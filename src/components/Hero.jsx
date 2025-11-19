import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/8nsoLg1te84JZcE9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto h-full flex items-center px-6">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-3">Invoice & Payment Automation</h1>
          <p className="text-slate-700 text-sm md:text-base max-w-xl">Create invoices, get paid via M-Pesa, and track cash flow — all in one simple tool for SMEs and agribusinesses.</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white pointer-events-none" />
    </section>
  )
}

export default Hero