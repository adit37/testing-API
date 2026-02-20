import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';

export const options = {
  scenarios: {
    scale_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 100 },   
        { duration: '1m', target: 100 },
        { duration: '1m', target: 500 },
        { duration: '1m', target: 500 },
        { duration: '1m', target: 1000 },
        { duration: '1m', target: 1000 },
        { duration: '30s', target: 0 },
      ],
      gracefulStop: '1m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
    'http_5xx_rate': ['rate==0'],
    'http_4xx_rate': ['rate<0.01'],
  },
  discardResponseBodies: true,
};

const http_5xx = new Counter('http_5xx');
const http_4xx = new Counter('http_4xx');
const http_timeout = new Counter('http_timeout');
const http_5xx_rate = new Rate('http_5xx_rate');
const http_4xx_rate = new Rate('http_4xx_rate');
const t_connect = new Trend('timings_connect');
const t_tls = new Trend('timings_tls');

export default function () {
  const res = http.get('https://testing-api-201098739954.asia-southeast1.run.app/records', {
    timeout: '3s', // set eksplisit untuk mendeteksi timeout
    tags: { endpoint: 'records' },
  });

  // Klasifikasi error
  if (res.error) {
    if (String(res.error).includes('timeout')) http_timeout.add(1);
  }
  if (res.status >= 500) { http_5xx.add(1); http_5xx_rate.add(1); }
  else if (res.status >= 400) { http_4xx.add(1); http_4xx_rate.add(1); }
  else { http_5xx_rate.add(0); http_4xx_rate.add(0); }

  // Simpan fase koneksi (indikasi bottleneck jaringan/TLS)
  t_connect.add(res.timings.connecting);
  t_tls.add(res.timings.tls_handshaking);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
