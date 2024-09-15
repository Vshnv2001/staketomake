'use client'

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/health_check`).then((response) => {
      console.log(response);
      setData(response.data.data);
      console.log(response.data);
    });
  });

  return (
    <div className="items-center justify-items-center p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      { data && (
        <div>
          <h2 className="text-2xl font-bold">FastAPI Health Check Response</h2>
          <br />
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
