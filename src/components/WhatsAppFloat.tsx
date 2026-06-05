'use client';

export default function WhatsAppFloat() {
  const handleChat = () => {
    const text = encodeURIComponent("Hello CrewConnect! I would like to inquire about your event manpower services.");
    window.open(`https://wa.me/919725705554?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-45 group">
      {/* Pulse ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-30 animate-ping -z-10 scale-110 duration-1000" />
      
      {/* Main button */}
      <button
        onClick={handleChat}
        className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border border-green-400/30 relative"
        title="Chat with us on WhatsApp"
        id="floating-whatsapp-btn"
      >
        {/* SVG WhatsApp Icon */}
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-3.535l.393.233c1.524.905 3.284 1.382 5.083 1.383 5.485 0 9.948-4.464 9.952-9.95.002-2.656-1.03-5.153-2.905-7.03C17.203 3.228 14.71 2.196 12.015 2.196c-5.495 0-9.96 4.467-9.964 9.953-.001 1.887.498 3.73 1.442 5.361l.26.45-1.006 3.67 3.76-.986zm11.548-7.534c-.31-.156-1.834-.905-2.11-.1-.278.1-.482.4-.592.526-.11.127-.22.19-.53.033-.31-.157-1.309-.483-2.493-1.54-.922-.82-1.544-1.833-1.725-2.146-.18-.313-.02-.482.137-.638.14-.14.31-.362.465-.544.156-.18.208-.31.31-.517.105-.207.053-.388-.026-.544-.08-.156-.731-1.761-1.002-2.41-.264-.636-.53-.55-.731-.56-.19-.01-.408-.01-.622-.01-.214 0-.564.08-.86.4-.296.32-1.131 1.106-1.131 2.697 0 1.59 1.157 3.129 1.317 3.345.16.216 2.277 3.478 5.516 4.88 2.698 1.168 3.25 1.05 3.967.92.716-.13 1.833-.748 2.093-1.434.26-.687.26-1.277.182-1.433-.078-.156-.285-.25-.595-.406z"/>
        </svg>
      </button>

      {/* Hover Tooltip */}
      <span className="absolute right-16 top-3 bg-slate-900 border border-slate-800 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
        WhatsApp Live Chat
      </span>
    </div>
  );
}
