import type {Handlers} from '$fresh/server.ts'
import Counter from "../islands/Counter.tsx";
import { TopHatBlack } from '../islands/TopHat.tsx';
import { Head } from '$fresh/runtime.ts'

export default function Home() {
  return (
      <div class="p-4 mx-auto max-w-screen-md">
        <TopHatBlack title='Federa'  description='descrbes federa' icon="/logo.svg" >
          <meta name="og:title" content="Federa" />
        </TopHatBlack>
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class="my-6">
          Welcome to `fresh`. Try updating this message in the ./routes/index.tsx
          file, and refresh.
        </p>
        <ul>
          <li><a href="/ast">ast</a></li>
          <li><a href="/ast/http://example.com">ast/url</a></li>
          <li><a href="/ast/composition/http://example.com">ast/composition/url</a></li>
          <li><a href="/user">user</a></li>
          <li><a href="/user/register">user/register</a></li>
          <li><a href="/login">login</a></li>
          <li><a href="/logout">logout</a></li>
        </ul>
      </div>
    
  );
}


// export const handler: Handlers = {
//   GET(req, ctx) {
//     const url = new URL(req.url);
//     const id = url.searchParams.get("id");
//     if (!id) return ctx.renderNotFound(); // return a 404 page if no id is provided
//     return ctx.render({ id });
//   },
// };