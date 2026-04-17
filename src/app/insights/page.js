'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default function InsightsPage() {
  const expenseData = {
    labels: ['Food', 'Transport', 'Stationery', 'Subscription'],
    datasets: [
      {
        data: [450, 150, 80, 119],
        backgroundColor: [
          '#facc15', // Pac-yellow
          '#0ea5e9', // Blue
          '#f43f5e', // Rose
          '#10b981', // Emerald
        ],
        borderColor: '#000000',
        borderWidth: 4,
      },
    ],
  };

  const trendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Spending',
        data: [120, 190, 30, 50, 200, 300, 450],
        borderColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.5)',
        tension: 0.4
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
             family: "'Space Grotesk', sans-serif",
             weight: 'bold'
          }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center">
      
      <div className="w-full bg-black p-6 rounded-xl arcade-border relative overflow-hidden flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-3xl font-black mb-2 font-arcade text-white shadow-[0_0_10px_white]">
           STATS <span className="text-[var(--color-pac-blue)]">&amp; DATA</span>
        </h1>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Analyze your run performance</p>
      </div>
      
      {/* Chart Section */}
      <div className="grid md:grid-cols-2 gap-6 w-full">
        
        <div className="bg-black arcade-border p-6 flex flex-col items-center relative">
           <h2 className="text-sm font-arcade uppercase tracking-wider w-full text-left mb-6 text-[var(--color-pac-yellow)]">Category Split</h2>
           <div className="w-full max-w-[250px] aspect-square relative">
             <Doughnut data={expenseData} options={options} />
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-30px]">
               <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Total</span>
               <span className="text-2xl font-black font-arcade">₹799</span>
             </div>
           </div>
        </div>

        <div className="bg-black arcade-border p-6 flex flex-col relative w-full">
           <h2 className="text-sm font-arcade uppercase tracking-wider mb-6 text-[var(--color-pac-yellow)]">Weekly Trend</h2>
           <div className="w-full flex-1 min-h-[220px]">
             <Line data={trendData} options={{ 
                 responsive: true, 
                 maintainAspectRatio: false, 
                 scales: { 
                    x: { grid: { color: '#1e3a8a33' }, ticks: { color: '#888', font: { family: 'Space Grotesk', weight: 'bold' } } }, 
                    y: { grid: { color: '#1e3a8a33' }, ticks: { color: '#888', font: { family: 'Space Grotesk', weight: 'bold' } } } 
                 } 
               }} 
             />
           </div>
        </div>

      </div>
      
      {/* Category Breakdown list */}
      <div className="w-full bg-black relative arcade-border p-6">
        <h3 className="font-bold mb-6 text-sm uppercase tracking-widest font-arcade text-[var(--color-pac-blue)]">Detailed Breakdown</h3>
        <div className="space-y-4">
          {expenseData.labels.map((label, i) => (
             <div key={label} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full border-2 border-black drop-shadow-md transition-transform group-hover:scale-125" style={{ backgroundColor: expenseData.datasets[0].backgroundColor[i] }}></div>
                   <span className="font-bold text-sm uppercase tracking-wider">{label}</span>
                </div>
                <div className="font-black font-arcade drop-shadow-md">
                   ₹{expenseData.datasets[0].data[i]}
                </div>
             </div>
          ))}
        </div>
      </div>

    </div>
  );
}
