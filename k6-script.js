import http from 'k6/http';
import { sleep, check } from 'k6';

// 🔧 Load URL dari environment variable (bisa diganti di pipeline)
const BASE_URL = __ENV.API_URL || 'https://testing-api-201098739954.asia-southeast1.run.app';

export const options = {
  vus: 25,               // jumlah virtual user (bisa disesuaikan)
  duration: '45s',       // durasi uji coba
  thresholds: {
    http_req_duration: ['p(95)<800'],  // 95% request harus <800ms
    http_req_failed: ['rate<0.01'],    // error rate <1%
  },
};

// 🧪 Load testing sederhana: GET endpoint /records
export default function () {
  const res = http.get(`${BASE_URL}/records`);

  check(res, {
    'status 200 OK': (r) => r.status === 200,
    'latency < 800ms': (r) => r.timings.duration < 800,
  });

  sleep(1); // tunggu 1 detik antar request
}
