function Hero() {
  return (
    <div className="left-0 mb-4 h-96 w-full rounded bg-hero bg-cover p-16 text-center shadow-inner shadow-black">
      <h1 className="text-2xl font-bold tracking-wide lg:text-4xl xl:text-6xl">
        Welcome to{" "}
        <span className="font-['Lobster'] text-light-red">recipebase</span>.
      </h1>
      <p className="pt-24 xl:text-base 2xl:text-xl">
        Discover a world of flavor with our community of home cooks and food
        lovers. Share your favorite recipes, connect with fellow food
        enthusiasts, and explore a diverse range of cuisines from around the
        world.
      </p>
    </div>
  )
}

export default Hero
