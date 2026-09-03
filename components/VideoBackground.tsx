export default function VideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <iframe
        src="https://www.youtube.com/embed/T7c1w4_8BsE?autoplay=1&mute=1&loop=1&playlist=T7c1w4_8BsE&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&modestbranding=1&iv_load_policy=3&fs=0"
        title="Background Video"
        className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
