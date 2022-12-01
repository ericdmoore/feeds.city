interface TestimonialProps {
  author: { name: string; title: string };
  bgImg: { src: string; alt: string };
  testimonial: string;
}
export function Testimonial(props: TestimonialProps) {
  const cssClass =
    `absolute inset-0 opacity-50 mix-blend-multiply saturate-0 filter`;
  return (
    <div class="bg-white py-16 lg:py-24">
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="relative overflow-hidden rounded-xl bg-indigo-500 py-24 px-8 shadow-2xl lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-16">
          <div class={cssClass}>
            <img
              src="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
              alt=""
              class="h-full w-full object-cover"
            />
          </div>
          <div class="relative lg:col-span-1">
            <img
              class="h-12 w-auto"
              src={props.bgImg.src}
              alt={props.bgImg.alt}
            />
            <blockquote class="mt-6 text-white">
              <p class="text-xl font-medium sm:text-2xl">{props.testimonial}</p>
              <footer class="mt-6">
                <p class="flex flex-col font-medium">
                  <span>{props.author.name}</span>
                  <span>{props.author.title}</span>
                </p>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;

/*
//
//



//
    <span></span>
 <span></span>
*/
