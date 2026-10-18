$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$baseUrl = 'https://www.zentao.net'
$catalogUrl = "$baseUrl/book/api/225.mhtml"
$projectRoot = $PSScriptRoot
$markdownDir = Join-Path $projectRoot 'docs/restful-api-v2.0'
$htmlDir = Join-Path $projectRoot 'source-html/restful-api-v2.0'
New-Item -ItemType Directory -Force -Path $markdownDir, $htmlDir | Out-Null

$catalog = $null
for ($attempt = 1; $attempt -le 4 -and -not $catalog; $attempt++) {
    try { $catalog = (Invoke-WebRequest -Uri $catalogUrl -TimeoutSec 60 -MaximumRedirection 5).Content }
    catch {
        if ($attempt -eq 4) { throw }
        Start-Sleep -Seconds (2 * $attempt)
    }
}
$v2Start = $catalog.IndexOf('禅道RESTful APIv2.0开发手册')
$endMatch = [regex]::Match($catalog.Substring([Math]::Max(0, $v2Start)), 'title=["'']?定制开发')
$v2End = if ($endMatch.Success) { $v2Start + $endMatch.Index } else { -1 }
if ($v2Start -lt 0 -or $v2End -le $v2Start) {
    throw 'Could not locate the RESTful API v2.0 section in the official catalogue.'
}
$v2Section = $catalog.Substring($v2Start, $v2End - $v2Start)
$links = [regex]::Matches($v2Section, '(?is)href=/book/api/([^ >]+)>(.*?)</a>')
$pages = [System.Collections.Generic.List[object]]::new()
foreach ($link in $links) {
    $href = $link.Groups[1].Value
    $title = [System.Net.WebUtility]::HtmlDecode([regex]::Replace($link.Groups[2].Value, '(?is)<[^>]+>', '')).Trim()
    if ($href -and $title -and -not ($pages | Where-Object Href -EQ $href)) {
        $pages.Add([pscustomobject]@{ Href = $href; Title = $title })
    }
}
if ($pages.Count -eq 0) { throw 'No RESTful API v2.0 pages were found in the official catalogue.' }

$downloadedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'
$indexedPages = for ($pageIndex = 0; $pageIndex -lt $pages.Count; $pageIndex++) {
    [pscustomobject]@{ Index = $pageIndex + 1; Page = $pages[$pageIndex] }
}
$results = $indexedPages | ForEach-Object -Parallel {
    $index = $_.Index
    $page = $_.Page
    $baseUrl = $using:baseUrl
    $markdownDir = $using:markdownDir
    $htmlDir = $using:htmlDir
    $downloadedAt = $using:downloadedAt
    try {
        $url = "$baseUrl/book/api/$($page.Href)"
        $html = $null
        for ($attempt = 1; $attempt -le 4 -and -not $html; $attempt++) {
            try { $html = (Invoke-WebRequest -Uri $url -TimeoutSec 45 -MaximumRedirection 5).Content }
            catch {
                if ($attempt -eq 4) { throw }
                Start-Sleep -Seconds (2 * $attempt)
            }
        }
        $contentMatch = [regex]::Match($html, '(?is)<section\b[^>]*class=["'']?article-content["'']?[^>]*>(.*?)</section>')
        if (-not $contentMatch.Success) { throw 'Article content section was not found.' }
        $body = $contentMatch.Groups[1].Value

        $body = [regex]::Replace($body, '(?is)<script\b.*?</script>|<style\b.*?</style>', '')
        $body = [regex]::Replace($body, '(?is)<pre\b[^>]*>(.*?)</pre>', {
            param($match)
            $code = [System.Net.WebUtility]::HtmlDecode([regex]::Replace($match.Groups[1].Value, '(?is)<[^>]+>', '')).Trim("`r", "`n")
            $fence = [string]([char]96) * 3
            "`n${fence}text`n$code`n$fence`n"
        })
        $body = [regex]::Replace($body, '(?is)<h([1-6])\b[^>]*>(.*?)</h\1>', {
            param($match)
            $level = [int]$match.Groups[1].Value
            $text = [regex]::Replace($match.Groups[2].Value, '(?is)<[^>]+>', '')
            "`n$(('#' * $level)) $text`n"
        })
        $body = [regex]::Replace($body, '(?is)<a\b[^>]*>(.*?)</a>', '$1')
        $body = [regex]::Replace($body, '(?is)<img\b[^>]*>', '[图片]')
        $body = [regex]::Replace($body, '(?is)<br\s*/?>|</p\s*>|</div\s*>|</section\s*>|</blockquote\s*>', "`n")
        $body = [regex]::Replace($body, '(?is)<li\b[^>]*>', "`n- ")
        $body = [regex]::Replace($body, '(?is)</li\s*>|</tr\s*>', "`n")
        $body = [regex]::Replace($body, '(?is)</t[dh]\s*>', ' | ')
        $body = [regex]::Replace($body, '(?is)<(p|div|section|ul|ol|table|thead|tbody|tr)\b[^>]*>', "`n")
        $body = [regex]::Replace($body, '(?is)<[^>]+>', '')
        $body = [System.Net.WebUtility]::HtmlDecode($body)
        $body = $body -replace "[\t ]+", ' ' -replace " *\| *\r?\n", " |`n" -replace "\n{3,}", "`n`n"
        $body = $body.Trim()

        $safeTitle = [regex]::Replace($page.Title, '[\\/:*?"<>|]', '-')
        $stem = '{0:D3}-{1}' -f $index, $safeTitle
        $markdown = "# $($page.Title)`n`n> 来源：[$url]($url)  `n> 下载时间：$downloadedAt`n`n$body`n"
        Set-Content -LiteralPath (Join-Path $markdownDir "$stem.md") -Value $markdown -Encoding utf8
        Set-Content -LiteralPath (Join-Path $htmlDir "$stem.html") -Value $html -Encoding utf8
        [pscustomobject]@{ Index = $index; Title = $page.Title; Url = $url; Status = 'downloaded'; File = "$stem.md" }
    } catch {
        [pscustomobject]@{ Index = $index; Title = $page.Title; Url = "$baseUrl/book/api/$($page.Href)"; Status = 'failed'; Error = $_.Exception.Message }
    }
} -ThrottleLimit 4

$results = @($results | Sort-Object Index)
$results | Export-Csv -LiteralPath (Join-Path $projectRoot 'manifest.csv') -NoTypeInformation -Encoding utf8
$indexLines = @(
    '# RESTful API v2.0 页面索引',
    '',
    "> 禅道官网目录当前收录 $($pages.Count) 篇页面；本地 Markdown 与 HTML 原文均按官网目录顺序编号。以 [manifest.csv](../../manifest.csv) 查看机器可读清单。",
    '',
    '| # | 页面 | 官方原文 |',
    '| ---: | --- | --- |'
)
foreach ($entry in $results) {
    if ($entry.Status -eq 'downloaded') {
        $indexLines += "| $($entry.Index) | [$($entry.Title)]($($entry.File)) | [官网]($($entry.Url)) |"
    } else {
        $indexLines += "| $($entry.Index) | $($entry.Title) | 下载失败：$($entry.Error) |"
    }
}
Set-Content -LiteralPath (Join-Path $markdownDir 'README.md') -Value ($indexLines -join "`n") -Encoding utf8
$successes = @($results | Where-Object Status -EQ 'downloaded').Count
$failures = @($results | Where-Object Status -EQ 'failed')
Write-Host "Official v2 pages found: $($pages.Count)"
Write-Host "Downloaded: $successes; failed: $($failures.Count)"
if ($failures.Count) { $failures | Format-Table Index, Title, Error -AutoSize; exit 1 }
