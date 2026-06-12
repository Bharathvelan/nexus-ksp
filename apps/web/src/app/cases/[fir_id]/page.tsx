import Layout from '@/components/Layout';
export default function CasePage({ params }: { params: { fir_id: string } }) {
  return (
    <Layout>
      <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-navy mb-2">Case Detail: {params.fir_id}</h2>
        <p className="text-gray-500 mb-6">Status: Open</p>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 className="font-bold text-blue-900 mb-2">AI Generated Case Summary</h3>
          <p className="text-blue-800">This case involves a series of coordinated two-wheeler thefts operating out of Indiranagar. The primary suspects are linked to SYN-12.</p>
        </div>
      </div>
    </Layout>
  );
}
