import { zh } from '@formkit/i18n';
import { defaultConfig } from '@formkit/vue';
import { rootClasses } from './formkit.theme';
import type { FormKitNode } from '@formkit/core';

const helloRule = function (node: FormKitNode): boolean | Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (node.value !== 'hello') {
        resolve(false);
      } else {
        resolve(true);
      }
    }, 500);
  });
};

export default defaultConfig({
  locales: { zh },
  locale: 'zh',
  rules: { hello: helloRule },
  config: {
    rootClasses,
  },
});
