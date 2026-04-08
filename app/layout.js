import './globals.css';

export const metadata = {
  title: 'Buzzer 行銷規劃看板',
  description: 'Buzzer 蜂任務三個月行銷規劃追蹤工具',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
