# Mock Server - Todos endpoints

This server exposes two todo endpoints backed by an in-memory list seeded with 20 items on startup.

## Endpoints

- GET /todos
  - Query params: `pageNum` (1-based, default 1), `pageSize` (default 10)
  - Response:
    {
      "list": [ { "id": number, "title": string, "completed": boolean }, ... ],
      "total": number,
      "pageNum": number,
      "pageSize": number
    }
- POST /todos
  - Body (JSON): { "title": string, "completed"?: boolean }
  - Response: created item: { id, title, completed }

Notes:
- Data is in-memory; restarting the server resets the list.

## Run

```cmd
cd mock-server
npm start
```

## Example

- GET first page (size 5):
  `http://localhost:3000/todos?pageNum=1&pageSize=5`

- Add a todo:

```http
POST http://localhost:3000/todos
Content-Type: application/json

{
  "title": "Buy milk",
  "completed": false
}
```
