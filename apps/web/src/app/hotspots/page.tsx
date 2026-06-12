import Layout from '@/components/Layout';
export default function HotspotsPage() {
  return (
    <Layout>
      <div className="h-full bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-navy mb-4">Karnataka Crime Hotspots</h2>
        <div className="h-[600px] border rounded bg-gray-50 flex items-center justify-center">
           <p className="text-gray-500">Deck.gl Heatmap loading over OpenStreetMap...</p>
        </div>
      </div>
    </Layout>
  );
}
