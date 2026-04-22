export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Alation Design Playground</h1>
      <p>Explore and prototype with Alation design system components.</p>
      <a href="/app/settings/custom_templates" style={{
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px'
      }}>
        View Template Editor
      </a>
    </div>
  );
}
