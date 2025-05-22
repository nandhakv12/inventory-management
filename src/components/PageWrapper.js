export default function PageWrapper({ title, children }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
      <div className="bg-white p-4 shadow rounded border">{children}</div>
    </div>
  );
}
