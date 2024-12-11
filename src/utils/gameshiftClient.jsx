import axios from 'axios';

const gameshiftClient = axios.create({
  baseURL: 'https://api.gameshift.dev/nx/users', // URL gốc của API GameShift
  headers: {
    'accept' : 'application/json',
    'x-api-key': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIyNzU1YTIyYy0wZDVhLTQyMjQtODdjNC03Zjk0N2JiNWZmZGUiLCJzdWIiOiI0ZjcwNTFhMi1mNjI3LTRmMTEtYmYyZC0wNzM0YjBlYmNhYTEiLCJpYXQiOjE3MzM3NjAzMTF9.j5lD9TPLsFpTGkS5Qhv5WJNn4TPNDsEiFsu3kEl2hLE`, // Thay YOUR_API_KEY bằng API Key của bạn
    'Content-Type': 'application/json',
  },
});

export default gameshiftClient;
