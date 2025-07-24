import { Head } from '@inertiajs/react'

export default function Home() {
  return (
    <>
      <Head title="Homepage" />

      <div className="fixed xl:absolute left-8 right-8 top-0 bottom-0 xl:inset-0 max-w-screen-xl mx-auto before:content-[''] before:[background:repeating-linear-gradient(0deg,var(--sand-5)_0_4px,transparent_0_8px)] before:absolute before:top-0 before:left-0 before:h-full before:w-px after:content-[''] after:[background:repeating-linear-gradient(0deg,var(--sand-5)_0_4px,transparent_0_8px)] after:absolute after:top-0 after:right-0 after:h-full after:w-px"></div>

      <div className="pt-4 h-full flex flex-col">
        {/* Header */}
        <div className="grow pb-4 bg-gradient-to-b from-sand-1 to-sand-2 flex justify-center items-center">
          <a href="https://adonisjs.com" target="_blank" className="isolate">
            <svg className="w-16 h-16 fill-primary" viewBox="0 0 33 33">
              <path
                fillRule="evenodd"
                d="M0 16.333c0 13.173 3.16 16.333 16.333 16.333 13.173 0 16.333-3.16 16.333-16.333C32.666 3.16 29.506 0 16.333 0 3.16 0 0 3.16 0 16.333Zm6.586 3.393L11.71 8.083c.865-1.962 2.528-3.027 4.624-3.027 2.096 0 3.759 1.065 4.624 3.027l5.123 11.643c.233.566.432 1.297.432 1.93 0 2.893-2.029 4.923-4.923 4.923-.986 0-1.769-.252-2.561-.506-.812-.261-1.634-.526-2.695-.526-1.048 0-1.89.267-2.718.529-.801.253-1.59.503-2.538.503-2.894 0-4.923-2.03-4.923-4.924 0-.632.2-1.363.432-1.929Zm9.747-9.613-5.056 11.443c1.497-.699 3.227-1.032 5.056-1.032 1.763 0 3.56.333 4.99 1.032l-4.99-11.444Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        {/* Bento with documentation, Adocasts, packages and Discord */}
        <div className="isolate mt-10 max-w-screen-xl mx-auto px-16 xl:px-8 grid grid-cols-1 xl:grid-cols-2 xl:grid-rows-3 gap-8">
          <article className="row-span-3 relative p-6 shadow-sm hover:shadow border border-sand-7 hover:border-sand-8 rounded-2xl transition ease-in-out duration-700 group flex flex-col gap-8">
            <div className="relative opacity-80">
              <svg fill="none" viewBox="0 0 240 105">
                <path fill="#F9F9F8" d="M0 4a4 4 0 0 1 4-4h232a4 4 0 0 1 4 4v101H0V4Z" />
                <g fill="#000" fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
                  <path d="M24 11.444c0 4.391 1.053 5.445 5.444 5.445s5.445-1.054 5.445-5.445c0-4.39-1.054-5.444-5.445-5.444C25.054 6 24 7.053 24 11.444Zm2.195 1.131 1.708-3.88c.288-.655.843-1.01 1.541-1.01.699 0 1.253.355 1.542 1.01l1.707 3.88c.078.189.144.433.144.644 0 .964-.676 1.64-1.64 1.64-.33 0-.59-.083-.854-.168-.271-.087-.545-.175-.899-.175-.35 0-.63.089-.906.176-.267.085-.53.168-.846.168-.964 0-1.64-.677-1.64-1.641 0-.211.066-.455.143-.644Zm3.25-3.204-1.686 3.814c.499-.233 1.075-.344 1.685-.344.588 0 1.187.111 1.664.344l-1.664-3.814Zm26.473-.678c-.378 0-.65.268-.65.64 0 .374.272.641.65.641s.651-.267.651-.64-.273-.64-.65-.64Zm-11.907 5.502c-1.009 0-1.738-.745-1.738-1.91 0-1.187.73-1.933 1.737-1.933.468 0 .814.158 1.019.468V8.86h1.05v5.25h-1.05v-.372c-.2.304-.546.456-1.019.456Zm-.667-1.91c0-.652.352-1.077.887-1.077.54 0 .887.42.887 1.071 0 .64-.346 1.056-.887 1.056-.535 0-.887-.415-.887-1.05Zm4.384-.011c0-.646.351-1.06.877-1.06.53 0 .882.414.882 1.06 0 .646-.352 1.06-.883 1.06-.525 0-.876-.414-.876-1.06Zm11.571.835c0 .194-.147.31-.52.31-.42 0-.682-.221-.682-.489h-1.05c.026.725.714 1.265 1.711 1.265.946 0 1.55-.42 1.55-1.165 0-.557-.358-.945-1.066-1.087l-.762-.152c-.23-.047-.367-.163-.367-.315 0-.226.23-.347.525-.347.42 0 .583.195.583.426h.997c-.026-.683-.562-1.203-1.56-1.203-.929 0-1.559.468-1.559 1.176 0 .64.415.93 1.035 1.06l.756.164c.247.052.41.157.41.357Zm-2.85 1.002h-1.05v-3.675h1.05v3.675Zm-4.264-3.675v.384c.268-.31.625-.468 1.066-.468.824 0 1.36.536 1.36 1.365v2.394h-1.05v-2.173c0-.446-.252-.714-.688-.714-.436 0-.688.268-.688.714v2.173h-1.05v-3.675h1.05Zm-3.58-.084c-1.119 0-1.948.809-1.948 1.922s.83 1.921 1.948 1.921c1.123 0 1.953-.808 1.953-1.921s-.83-1.922-1.953-1.922Zm-8.758.856c-.535 0-.887.425-.887 1.076 0 .636.352 1.05.887 1.05.54 0 .887-.414.887-1.055 0-.65-.346-1.07-.887-1.07Zm-1.958 1.076c0 1.166.73 1.911 1.732 1.911.478 0 .82-.152 1.024-.456v.372h1.05v-3.675h-1.05v.384c-.21-.31-.556-.468-1.024-.468-1.003 0-1.732.746-1.732 1.932Z" />
                </g>
                <rect width="8" height="3" x="162" y="9.944" fill="#DAD9D6" rx="1" />
                <rect width="14" height="3" x="174" y="9.944" fill="#DAD9D6" rx="1" />
                <rect width="10" height="3" x="192" y="9.944" fill="#DAD9D6" rx="1" />
                <rect width="10" height="3" x="206" y="9.944" fill="#DAD9D6" rx="1" />
                <rect width="81" height="6" x="24" y="32" fill="#DAD9D6" rx="2" />
                <rect width="95" height="6" x="24" y="44" fill="#DAD9D6" rx="2" />
                <rect width="16" height="5" x="24" y="60" fill="#21201C" rx="1" />
                <path fill="#DAD9D6" d="M24 85a4 4 0 0 1 4-4h184a4 4 0 0 1 4 4v20H24V85Z" />
                <path
                  fill="url(#b)"
                  fillOpacity=".2"
                  d="M24 85a4 4 0 0 1 4-4h184a4 4 0 0 1 4 4v20H24V85Z"
                />
                <defs>
                  <linearGradient
                    id="b"
                    x1="120"
                    x2="120"
                    y1="81"
                    y2="105"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopOpacity="0" />
                    <stop offset="1" stopColor="#82827C" />
                  </linearGradient>
                  <clipPath id="a">
                    <path fill="#fff" d="M24 6h36.307v10.889H24z" />
                  </clipPath>
                </defs>
              </svg>

              <div className="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-b from-white/0 to-white"></div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="shrink-0 w-10 h-10 bg-primary/20 rounded-md flex justify-center items-center">
                <svg className="h-6 w-6 fill-primary" viewBox="0 0 256 256">
                  <path
                    fill="currentColor"
                    d="M208 24H72a32 32 0 0 0-32 32v168a8 8 0 0 0 8 8h144a8 8 0 0 0 0-16H56a16 16 0 0 1 16-16h136a8 8 0 0 0 8-8V32a8 8 0 0 0-8-8m-88 16h48v72l-19.21-14.4a8 8 0 0 0-9.6 0L120 112Zm80 144H72a31.8 31.8 0 0 0-16 4.29V56a16 16 0 0 1 16-16h32v88a8 8 0 0 0 12.8 6.4L144 114l27.21 20.4A8 8 0 0 0 176 136a8 8 0 0 0 8-8V40h16Z"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-semibold">
                  <a href="https://docs.adonisjs.com" target="_blank">
                    <span>Documentation</span>
                    <span className="absolute inset-0"></span>
                  </a>
                </h2>

                <p className="text-sm text-sand-11 group-hover:text-sand-12 transition ease-in-out duration-700">
                  Dive into the official documentation to learn AdonisJS. Read carefully to discover
                  an unmatched set of features, best practices and developer experience. Through
                  examples, guides and API references, you'll find everything you need to build your
                  next project. From installation to deployment, we've got you covered.
                </p>
              </div>
            </div>
          </article>

          <article className="relative p-6 shadow-sm hover:shadow border border-sand-7 hover:border-sand-8 rounded-2xl transition ease-in-out duration-700 group flex flex-row gap-4">
            <div className="shrink-0 w-10 h-10 bg-primary/20 rounded-md flex justify-center items-center">
              <svg className="h-6 w-6 fill-primary" viewBox="0 0 256 256">
                <path
                  fill="currentColor"
                  d="m164.44 105.34-48-32A8 8 0 0 0 104 80v64a8 8 0 0 0 12.44 6.66l48-32a8 8 0 0 0 0-13.32M120 129.05V95l25.58 17ZM216 40H40a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 128H40V56h176zm16 40a8 8 0 0 1-8 8H32a8 8 0 0 1 0-16h192a8 8 0 0 1 8 8"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                <a href="https://adocasts.com" target="_blank">
                  <span>Adocasts</span>
                  <span className="absolute inset-0"></span>
                </a>
              </h2>

              <p className="text-sm text-sand-11 group-hover:text-sand-12 transition ease-in-out duration-700">
                Level up your development and Adonis skills with hours of video content, from
                beginner to advanced, through databases, testing, and more.
              </p>
            </div>
          </article>

          <article className="relative p-6 shadow-sm hover:shadow border border-sand-7 hover:border-sand-8 rounded-2xl transition ease-in-out duration-700 group flex flex-row gap-4">
            <div className="shrink-0 w-10 h-10 bg-primary/20 rounded-md flex justify-center items-center">
              <svg className="h-6 w-6 fill-primary" viewBox="0 0 256 256">
                <path
                  fill="currentColor"
                  d="M208 96a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-32a16 16 0 0 0-16 16v8H96v-8a16 16 0 0 0-16-16H48a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h8v64h-8a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-8h64v8a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-8V96Zm-32-48h32v32h-32ZM48 48h32v15.9a.5.5 0 0 0 0 .2V80H48Zm32 160H48v-32h32v15.9a.5.5 0 0 0 0 .2zm128 0h-32v-32h32Zm-24-48h-8a16 16 0 0 0-16 16v8H96v-8a16 16 0 0 0-16-16h-8V96h8a16 16 0 0 0 16-16v-8h64v8a16 16 0 0 0 16 16h8Z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                <a href="https://packages.adonisjs.com" target="_blank">
                  <span>Packages</span>
                  <span className="absolute inset-0"></span>
                </a>
              </h2>

              <p className="text-sm text-sand-11 group-hover:text-sand-12 transition ease-in-out duration-700">
                Supercharge your AdonisJS application with packages built and maintained by both the
                core team and the community.
              </p>
            </div>
          </article>

          <article className="relative p-6 shadow-sm hover:shadow border border-sand-7 hover:border-sand-8 rounded-2xl transition ease-in-out duration-700 group flex flex-row gap-4">
            <div className="shrink-0 w-10 h-10 bg-primary/20 rounded-md flex justify-center items-center">
              <svg className="h-6 w-6 fill-primary" viewBox="0 0 256 256">
                <path
                  fill="currentColor"
                  d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m44.42-143.16-64 32a8.05 8.05 0 0 0-3.58 3.58l-32 64A8 8 0 0 0 80 184a8.1 8.1 0 0 0 3.58-.84l64-32a8.05 8.05 0 0 0 3.58-3.58l32-64a8 8 0 0 0-10.74-10.74M138 138l-40.11 20.11L118 118l40.15-20.07Z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                <a href="https://discord.gg/vDcEjq6" target="_blank">
                  <span>Discord</span>
                  <span className="absolute inset-0"></span>
                </a>
              </h2>

              <p className="text-sm text-sand-11 group-hover:text-sand-12 transition ease-in-out duration-700">
                Never get lost again, ask questions, and share your knowledge or projects with a
                growing and supportive community. Join us.
              </p>
            </div>
          </article>
        </div>

        {/* Features */}
        <div className="grow mt-10 mb-8 px-16 xl:px-8 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <article className="relative py-4 px-5 bg-white border border-transparent rounded-lg hover:border-sand-8 hover:shadow-sm transition duration-100 ease-in-out group">
              <h2 className="font-semibold text-sand-12">
                <a
                  href="https://lucid.adonisjs.com"
                  target="_blank"
                  className="flex flex-row gap-2"
                >
                  <span className="bg-[#D5EAE7] h-6 w-6 flex justify-center items-center rounded">
                    <svg className="h-4 w-4 fill-[#0E766E]" viewBox="0 0 24 24">
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="M4 6a8 3 0 1 0 16 0A8 3 0 1 0 4 6" />
                        <path d="M4 6v6a8 3 0 0 0 16 0V6" />
                        <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
                      </g>
                    </svg>
                  </span>
                  <span>Lucid</span>
                  <span className="absolute inset-0"></span>
                </a>
              </h2>

              <p className="mt-4 text-sm text-sand-11 group-hover:text-sand-12 transition ease-in-out duration-100">
                A SQL ORM with a powerful query builder, active record, migrations, and model
                factories. Everything you need to work with databases.
              </p>

              <svg
                className="absolute top-4 right-5 opacity-0 group-hover:opacity-100 text-sand-9 w-4 h-4 transition ease-in-out duration-100"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1 9-9m-5 0h5v5"
                />
              </svg>
            </article>

            <article className="relative py-4 px-5 bg-white border border-transparent rounded-lg hover:border-sand-8 hover:shadow-sm transition duration-100 ease-in-out group">
              <h2 className="font-semibold text-sand-12">
                <a href="https://vinejs.dev/" target="_blank" className="flex flex-row gap-2">
                  <span className="bg-[#F3DBFC] h-6 w-6 flex justify-center items-center rounded">
                    <svg className="h-4 w-4 fill-[#CA5AF2]" viewBox="0 0 24 24">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3a12 12 0 0 0 8.5 3A12 12 0 0 1 12 21 12 12 0 0 1 3.5 6 12 12 0 0 0 12 3"
                      />
                    </svg>
                  </span>
                  <span>Vine</span>
                  <span className="absolute inset-0"></span>
                </a>
              </h2>

              <p className="mt-4 text-sm text-sand-11 group-hover:text-sand-12 transition ease-in-out duration-100">
                A yet simple but feature rich and type-safe form data validation. It comes with 50+
                built-in rules and an expressive API to define custom rules.
              </p>

              <svg
                className="absolute top-4 right-5 opacity-0 group-hover:opacity-100 text-sand-9 w-4 h-4 transition ease-in-out duration-100"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1 9-9m-5 0h5v5"
                />
              </svg>
            </article>

            <article className="relative py-4 px-5 bg-white border border-transparent rounded-lg hover:border-sand-8 hover:shadow-sm transition duration-100 ease-in-out group">
              <h2 className="font-semibold text-sand-12">
                <a href="https://inertiajs.com/" target="_blank" className="flex flex-row gap-2">
                  <span className="bg-[#B8EAE0] h-6 w-6 flex justify-center items-center rounded">
                    <svg className="h-4 w-4 fill-[#4BBBA5]" viewBox="0 0 24 24">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m12.5 8l4 4l-4 4H17l4-4l-4-4zm-9 0l4 4l-4 4H8l4-4l-4-4z"
                      />
                    </svg>
                  </span>
                  <span>InertiaJS</span>
                  <span className="absolute inset-0"></span>
                </a>
              </h2>

              <p className="mt-4 text-sm text-sand-11 group-hover:text-sand-12 transition ease-in-out duration-100">
                The modern monolithic application architecture. It allows you to build single-page
                applications without building an API.
              </p>

              <svg
                className="absolute top-4 right-5 opacity-0 group-hover:opacity-100 text-sand-9 w-4 h-4 transition ease-in-out duration-100"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1 9-9m-5 0h5v5"
                />
              </svg>
            </article>

            <article className="relative py-4 px-5 bg-white border border-transparent rounded-lg hover:border-sand-8 hover:shadow-sm transition duration-100 ease-in-out group">
              <h2 className="font-semibold text-sand-12">
                <a href="https://japa.dev" target="_blank" className="flex flex-row gap-2">
                  <span className="bg-[#FACDDC] h-6 w-6 flex justify-center items-center rounded">
                    <svg className="h-4 w-4 fill-[#DD3074]" viewBox="0 0 256 256">
                      <path
                        fill="currentColor"
                        d="m240.49 83.51-60-60a12 12 0 0 0-17 0L34.28 152.75a48.77 48.77 0 0 0 69 69l111.2-111.26 21.31-7.11a12 12 0 0 0 4.7-19.87M86.28 204.75a24.77 24.77 0 0 1-35-35l28.13-28.13c7.73-2.41 19.58-3 35.06 5a84 84 0 0 0 21.95 8ZM204.2 88.62a12.15 12.15 0 0 0-4.69 2.89l-38.89 38.9c-7.73 2.41-19.58 3-35.06-5a84 84 0 0 0-21.94-8L172 49l37.79 37.79Z"
                      />
                    </svg>
                  </span>
                  <span>Japa</span>
                  <span className="absolute inset-0"></span>
                </a>
              </h2>

              <p className="mt-4 text-sm text-sand-11 group-hover:text-sand-12 transition ease-in-out duration-100">
                From JSON API tests using Open API schema to browser tests with Playwrighht, it
                comes with everything you need to test your application.
              </p>

              <svg
                className="absolute top-4 right-5 opacity-0 group-hover:opacity-100 text-sand-9 w-4 h-4 transition ease-in-out duration-100"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1 9-9m-5 0h5v5"
                />
              </svg>
            </article>
          </div>
        </div>

        <div className="text-sm text-center [&>code]:font-medium [&>code]:text-[#a599ff] bg-sand-12 text-sand-1 fixed bottom-0 left-0 right-0 py-2">
          Route for this page is registered in <code>start/routes.ts</code> file, rendering{' '}
          <code>inertia/pages/home.tsx</code> template
        </div>
      </div>
    </>
  )
}