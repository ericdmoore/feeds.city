import { type JSX } from "preact";

type StyledIntrinsicsDict = {
	[P in keyof JSX.IntrinsicElements]: { addClass: string[]; replaceWithClass?: string } & JSX.IntrinsicElements[P];
};

export const components = (
	topProp: Partial<{
		commonThemeCSS: string;
		themedComponentDict: StyledIntrinsicsDict;
	}>,
) => {
	return {
		a: (props: StyledIntrinsicsDict["a"]) => {
			const { children, ...rest } = props;
			return (
				<a
					{...{
						...rest,
						...topProp.themedComponentDict?.a,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</a>
			);
		},
		abbr: (props: StyledIntrinsicsDict["abbr"]) => {
			const { children, ...rest } = props;
			return (
				<abbr
					{...{
						...rest,
						...topProp.themedComponentDict?.abbr,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</abbr>
			);
		},
		address: (props: StyledIntrinsicsDict["address"]) => {
			const { children, ...rest } = props;
			return (
				<address
					{...{
						...rest,
						...topProp.themedComponentDict?.address,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</address>
			);
		},
		area: (props: StyledIntrinsicsDict["area"]) => {
			const { children, ...rest } = props;
			return (
				<area
					{...{
						...rest,
						...topProp.themedComponentDict?.area,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</area>
			);
		},
		article: (props: StyledIntrinsicsDict["article"]) => {
			const { children, ...rest } = props;
			return (
				<article
					{...{
						...rest,
						...topProp.themedComponentDict?.article,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</article>
			);
		},
		aside: (props: StyledIntrinsicsDict["aside"]) => {
			const { children, ...rest } = props;
			return (
				<aside
					{...{
						...rest,
						...topProp.themedComponentDict?.aside,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</aside>
			);
		},
		audio: (props: StyledIntrinsicsDict["audio"]) => {
			const { children, ...rest } = props;
			return (
				<audio
					{...{
						...rest,
						...topProp.themedComponentDict?.audio,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</audio>
			);
		},
		b: (props: StyledIntrinsicsDict["b"]) => {
			const { children, ...rest } = props;
			return (
				<b
					{...{
						...rest,
						...topProp.themedComponentDict?.b,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</b>
			);
		},
		base: (props: StyledIntrinsicsDict["base"]) => {
			const { children, ...rest } = props;
			return (
				<base
					{...{
						...rest,
						...topProp.themedComponentDict?.base,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</base>
			);
		},
		bdi: (props: StyledIntrinsicsDict["bdi"]) => {
			const { children, ...rest } = props;
			return (
				<bdi
					{...{
						...rest,
						...topProp.themedComponentDict?.bdi,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</bdi>
			);
		},
		bdo: (props: StyledIntrinsicsDict["bdo"]) => {
			const { children, ...rest } = props;
			return (
				<bdo
					{...{
						...rest,
						...topProp.themedComponentDict?.bdo,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</bdo>
			);
		},
		big: (props: StyledIntrinsicsDict["big"]) => {
			const { children, ...rest } = props;
			return (
				<big
					{...{
						...rest,
						...topProp.themedComponentDict?.big,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</big>
			);
		},
		blockquote: (props: StyledIntrinsicsDict["blockquote"]) => {
			const { children, ...rest } = props;
			return (
				<blockquote
					{...{
						...rest,
						...topProp.themedComponentDict?.blockquote,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</blockquote>
			);
		},
		body: (props: StyledIntrinsicsDict["body"]) => {
			const { children, ...rest } = props;
			return (
				<body
					{...{
						...rest,
						...topProp.themedComponentDict?.body,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</body>
			);
		},
		br: (props: StyledIntrinsicsDict["br"]) => {
			const { children, ...rest } = props;
			return (
				<br
					{...{
						...rest,
						...topProp.themedComponentDict?.br,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</br>
			);
		},
		button: (props: StyledIntrinsicsDict["button"]) => {
			const { children, ...rest } = props;
			return (
				<button
					{...{
						...rest,
						...topProp.themedComponentDict?.button,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</button>
			);
		},
		canvas: (props: StyledIntrinsicsDict["canvas"]) => {
			const { children, ...rest } = props;
			return (
				<canvas
					{...{
						...rest,
						...topProp.themedComponentDict?.canvas,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</canvas>
			);
		},
		caption: (props: StyledIntrinsicsDict["caption"]) => {
			const { children, ...rest } = props;
			return (
				<caption
					{...{
						...rest,
						...topProp.themedComponentDict?.caption,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</caption>
			);
		},
		cite: (props: StyledIntrinsicsDict["cite"]) => {
			const { children, ...rest } = props;
			return (
				<cite
					{...{
						...rest,
						...topProp.themedComponentDict?.cite,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</cite>
			);
		},
		code: (props: StyledIntrinsicsDict["code"]) => {
			const { children, ...rest } = props;
			return (
				<code
					{...{
						...rest,
						...topProp.themedComponentDict?.code,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</code>
			);
		},
		col: (props: StyledIntrinsicsDict["col"]) => {
			const { children, ...rest } = props;
			return (
				<col
					{...{
						...rest,
						...topProp.themedComponentDict?.col,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</col>
			);
		},
		colgroup: (props: StyledIntrinsicsDict["colgroup"]) => {
			const { children, ...rest } = props;
			return (
				<colgroup
					{...{
						...rest,
						...topProp.themedComponentDict?.colgroup,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</colgroup>
			);
		},
		data: (props: StyledIntrinsicsDict["data"]) => {
			const { children, ...rest } = props;
			return (
				<data
					{...{
						...rest,
						...topProp.themedComponentDict?.data,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</data>
			);
		},
		datalist: (props: StyledIntrinsicsDict["datalist"]) => {
			const { children, ...rest } = props;
			return (
				<datalist
					{...{
						...rest,
						...topProp.themedComponentDict?.datalist,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</datalist>
			);
		},
		dd: (props: StyledIntrinsicsDict["dd"]) => {
			const { children, ...rest } = props;
			return (
				<dd
					{...{
						...rest,
						...topProp.themedComponentDict?.dd,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</dd>
			);
		},
		del: (props: StyledIntrinsicsDict["del"]) => {
			const { children, ...rest } = props;
			return (
				<del
					{...{
						...rest,
						...topProp.themedComponentDict?.del,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</del>
			);
		},
		details: (props: StyledIntrinsicsDict["details"]) => {
			const { children, ...rest } = props;
			return (
				<details
					{...{
						...rest,
						...topProp.themedComponentDict?.details,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</details>
			);
		},
		dfn: (props: StyledIntrinsicsDict["dfn"]) => {
			const { children, ...rest } = props;
			return (
				<dfn
					{...{
						...rest,
						...topProp.themedComponentDict?.dfn,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</dfn>
			);
		},
		dialog: (props: StyledIntrinsicsDict["dialog"]) => {
			const { children, ...rest } = props;
			return (
				<dialog
					{...{
						...rest,
						...topProp.themedComponentDict?.dialog,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</dialog>
			);
		},
		div: (props: StyledIntrinsicsDict["div"]) => {
			const { children, ...rest } = props;
			return (
				<div
					{...{
						...rest,
						...topProp.themedComponentDict?.div,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</div>
			);
		},
		dl: (props: StyledIntrinsicsDict["dl"]) => {
			const { children, ...rest } = props;
			return (
				<dl
					{...{
						...rest,
						...topProp.themedComponentDict?.dl,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</dl>
			);
		},
		dt: (props: StyledIntrinsicsDict["dt"]) => {
			const { children, ...rest } = props;
			return (
				<dt
					{...{
						...rest,
						...topProp.themedComponentDict?.dt,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</dt>
			);
		},
		em: (props: StyledIntrinsicsDict["em"]) => {
			const { children, ...rest } = props;
			return (
				<em
					{...{
						...rest,
						...topProp.themedComponentDict?.em,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</em>
			);
		},
		embed: (props: StyledIntrinsicsDict["embed"]) => {
			const { children, ...rest } = props;
			return (
				<embed
					{...{
						...rest,
						...topProp.themedComponentDict?.embed,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</embed>
			);
		},
		fieldset: (props: StyledIntrinsicsDict["fieldset"]) => {
			const { children, ...rest } = props;
			return (
				<fieldset
					{...{
						...rest,
						...topProp.themedComponentDict?.fieldset,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</fieldset>
			);
		},
		figcaption: (props: StyledIntrinsicsDict["figcaption"]) => {
			const { children, ...rest } = props;
			return (
				<figcaption
					{...{
						...rest,
						...topProp.themedComponentDict?.figcaption,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</figcaption>
			);
		},
		figure: (props: StyledIntrinsicsDict["figure"]) => {
			const { children, ...rest } = props;
			return (
				<figure
					{...{
						...rest,
						...topProp.themedComponentDict?.figure,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</figure>
			);
		},
		footer: (props: StyledIntrinsicsDict["footer"]) => {
			const { children, ...rest } = props;
			return (
				<footer
					{...{
						...rest,
						...topProp.themedComponentDict?.footer,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</footer>
			);
		},
		form: (props: StyledIntrinsicsDict["form"]) => {
			const { children, ...rest } = props;
			return (
				<form
					{...{
						...rest,
						...topProp.themedComponentDict?.form,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</form>
			);
		},
		h1: (props: StyledIntrinsicsDict["h1"]) => {
			const { children, ...rest } = props;
			return (
				<h1
					{...{
						...rest,
						...topProp.themedComponentDict?.h1,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</h1>
			);
		},
		h2: (props: StyledIntrinsicsDict["h2"]) => {
			const { children, ...rest } = props;
			return (
				<h2
					{...{
						...rest,
						...topProp.themedComponentDict?.h2,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</h2>
			);
		},
		h3: (props: StyledIntrinsicsDict["h3"]) => {
			const { children, ...rest } = props;
			return (
				<h3
					{...{
						...rest,
						...topProp.themedComponentDict?.h3,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</h3>
			);
		},
		h4: (props: StyledIntrinsicsDict["h4"]) => {
			const { children, ...rest } = props;
			return (
				<h4
					{...{
						...rest,
						...topProp.themedComponentDict?.h4,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</h4>
			);
		},
		h5: (props: StyledIntrinsicsDict["h5"]) => {
			const { children, ...rest } = props;
			return (
				<h5
					{...{
						...rest,
						...topProp.themedComponentDict?.h5,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</h5>
			);
		},
		h6: (props: StyledIntrinsicsDict["h6"]) => {
			const { children, ...rest } = props;
			return (
				<h6
					{...{
						...rest,
						...topProp.themedComponentDict?.h6,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</h6>
			);
		},
		head: (props: StyledIntrinsicsDict["head"]) => {
			const { children, ...rest } = props;
			return (
				<head
					{...{
						...rest,
						...topProp.themedComponentDict?.head,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</head>
			);
		},
		header: (props: StyledIntrinsicsDict["header"]) => {
			const { children, ...rest } = props;
			return (
				<header
					{...{
						...rest,
						...topProp.themedComponentDict?.header,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</header>
			);
		},
		hgroup: (props: StyledIntrinsicsDict["hgroup"]) => {
			const { children, ...rest } = props;
			return (
				<hgroup
					{...{
						...rest,
						...topProp.themedComponentDict?.hgroup,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</hgroup>
			);
		},
		hr: (props: StyledIntrinsicsDict["hr"]) => {
			const { children, ...rest } = props;
			return (
				<hr
					{...{
						...rest,
						...topProp.themedComponentDict?.hr,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</hr>
			);
		},
		html: (props: StyledIntrinsicsDict["html"]) => {
			const { children, ...rest } = props;
			return (
				<html
					{...{
						...rest,
						...topProp.themedComponentDict?.html,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</html>
			);
		},
		i: (props: StyledIntrinsicsDict["i"]) => {
			const { children, ...rest } = props;
			return (
				<i
					{...{
						...rest,
						...topProp.themedComponentDict?.i,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</i>
			);
		},
		iframe: (props: StyledIntrinsicsDict["iframe"]) => {
			const { children, ...rest } = props;
			return (
				<iframe
					{...{
						...rest,
						...topProp.themedComponentDict?.iframe,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</iframe>
			);
		},
		img: (props: StyledIntrinsicsDict["img"]) => {
			const { children, ...rest } = props;
			return (
				<img
					{...{
						...rest,
						...topProp.themedComponentDict?.img,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</img>
			);
		},
		input: (props: StyledIntrinsicsDict["input"]) => {
			const { children, ...rest } = props;
			return (
				<input
					{...{
						...rest,
						...topProp.themedComponentDict?.input,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</input>
			);
		},
		ins: (props: StyledIntrinsicsDict["ins"]) => {
			const { children, ...rest } = props;
			return (
				<ins
					{...{
						...rest,
						...topProp.themedComponentDict?.ins,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</ins>
			);
		},
		kbd: (props: StyledIntrinsicsDict["kbd"]) => {
			const { children, ...rest } = props;
			return (
				<kbd
					{...{
						...rest,
						...topProp.themedComponentDict?.kbd,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</kbd>
			);
		},
		keygen: (props: StyledIntrinsicsDict["keygen"]) => {
			const { children, ...rest } = props;
			return (
				<keygen
					{...{
						...rest,
						...topProp.themedComponentDict?.keygen,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</keygen>
			);
		},
		label: (props: StyledIntrinsicsDict["label"]) => {
			const { children, ...rest } = props;
			return (
				<label
					{...{
						...rest,
						...topProp.themedComponentDict?.label,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</label>
			);
		},
		legend: (props: StyledIntrinsicsDict["legend"]) => {
			const { children, ...rest } = props;
			return (
				<legend
					{...{
						...rest,
						...topProp.themedComponentDict?.legend,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</legend>
			);
		},
		li: (props: StyledIntrinsicsDict["li"]) => {
			const { children, ...rest } = props;
			return (
				<li
					{...{
						...rest,
						...topProp.themedComponentDict?.li,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</li>
			);
		},
		link: (props: StyledIntrinsicsDict["link"]) => {
			const { children, ...rest } = props;
			return (
				<link
					{...{
						...rest,
						...topProp.themedComponentDict?.link,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</link>
			);
		},
		main: (props: StyledIntrinsicsDict["main"]) => {
			const { children, ...rest } = props;
			const themedA = topProp.themedComponentDict?.main;
			return (
				<main
					{...{
						...rest,
						...topProp.themedComponentDict?.main,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</main>
			);
		},
		map: (props: StyledIntrinsicsDict["map"]) => {
			const { children, ...rest } = props;
			return (
				<map
					{...{
						...rest,
						...topProp.themedComponentDict?.map,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</map>
			);
		},
		mark: (props: StyledIntrinsicsDict["mark"]) => {
			const { children, ...rest } = props;
			return (
				<mark
					{...{
						...rest,
						...topProp.themedComponentDict?.mark,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</mark>
			);
		},
		marquee: (props: StyledIntrinsicsDict["marquee"]) => {
			const { children, ...rest } = props;
			return (
				<marquee
					{...{
						...rest,
						...topProp.themedComponentDict?.marquee,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</marquee>
			);
		},
		menu: (props: StyledIntrinsicsDict["menu"]) => {
			const { children, ...rest } = props;
			return (
				<menu
					{...{
						...rest,
						...topProp.themedComponentDict?.menu,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</menu>
			);
		},
		menuitem: (props: StyledIntrinsicsDict["menuitem"]) => {
			const { children, ...rest } = props;
			return (
				<menuitem
					{...{
						...rest,
						...topProp.themedComponentDict?.menuitem,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</menuitem>
			);
		},
		meta: (props: StyledIntrinsicsDict["meta"]) => {
			const { children, ...rest } = props;
			return (
				<meta
					{...{
						...rest,
						...topProp.themedComponentDict?.meta,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</meta>
			);
		},
		meter: (props: StyledIntrinsicsDict["meter"]) => {
			const { children, ...rest } = props;
			return (
				<meter
					{...{
						...rest,
						...topProp.themedComponentDict?.meter,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</meter>
			);
		},
		nav: (props: StyledIntrinsicsDict["nav"]) => {
			const { children, ...rest } = props;
			return (
				<nav
					{...{
						...rest,
						...topProp.themedComponentDict?.nav,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</nav>
			);
		},
		noscript: (props: StyledIntrinsicsDict["noscript"]) => {
			const { children, ...rest } = props;
			return (
				<noscript
					{...{
						...rest,
						...topProp.themedComponentDict?.noscript,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</noscript>
			);
		},
		object: (props: StyledIntrinsicsDict["object"]) => {
			const { children, ...rest } = props;
			return (
				<object
					{...{
						...rest,
						...topProp.themedComponentDict?.object,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</object>
			);
		},
		ol: (props: StyledIntrinsicsDict["ol"]) => {
			const { children, ...rest } = props;
			return (
				<ol
					{...{
						...rest,
						...topProp.themedComponentDict?.ol,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</ol>
			);
		},
		optgroup: (props: StyledIntrinsicsDict["optgroup"]) => {
			const { children, ...rest } = props;
			return (
				<optgroup
					{...{
						...rest,
						...topProp.themedComponentDict?.optgroup,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</optgroup>
			);
		},
		option: (props: StyledIntrinsicsDict["option"]) => {
			const { children, ...rest } = props;
			return (
				<option
					{...{
						...rest,
						...topProp.themedComponentDict?.option,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</option>
			);
		},
		output: (props: StyledIntrinsicsDict["output"]) => {
			const { children, ...rest } = props;
			return (
				<output
					{...{
						...rest,
						...topProp.themedComponentDict?.output,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</output>
			);
		},
		p: (props: StyledIntrinsicsDict["p"]) => {
			const { children, ...rest } = props;
			return (
				<p
					{...{
						...rest,
						...topProp.themedComponentDict?.p,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</p>
			);
		},
		param: (props: StyledIntrinsicsDict["param"]) => {
			const { children, ...rest } = props;
			return (
				<param
					{...{
						...rest,
						...topProp.themedComponentDict?.param,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</param>
			);
		},
		picture: (props: StyledIntrinsicsDict["picture"]) => {
			const { children, ...rest } = props;
			return (
				<picture
					{...{
						...rest,
						...topProp.themedComponentDict?.picture,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</picture>
			);
		},
		pre: (props: StyledIntrinsicsDict["pre"]) => {
			const { children, ...rest } = props;
			return (
				<pre
					{...{
						...rest,
						...topProp.themedComponentDict?.pre,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				> {props.children}</pre>
			);
		},
		progress: (props: StyledIntrinsicsDict["progress"]) => {
			const { children, ...rest } = props;
			return (
				<progress
					{...{
						...rest,
						...topProp.themedComponentDict?.progress,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</progress>
			);
		},
		q: (props: StyledIntrinsicsDict["q"]) => {
			const { children, ...rest } = props;
			return (
				<q
					{...{
						...rest,
						...topProp.themedComponentDict?.q,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</q>
			);
		},
		rp: (props: StyledIntrinsicsDict["rp"]) => {
			const { children, ...rest } = props;
			return (
				<rp
					{...{
						...rest,
						...topProp.themedComponentDict?.rp,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</rp>
			);
		},
		rt: (props: StyledIntrinsicsDict["rt"]) => {
			const { children, ...rest } = props;
			return (
				<rt
					{...{
						...rest,
						...topProp.themedComponentDict?.rt,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</rt>
			);
		},
		ruby: (props: StyledIntrinsicsDict["ruby"]) => {
			const { children, ...rest } = props;
			return (
				<ruby
					{...{
						...rest,
						...topProp.themedComponentDict?.ruby,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</ruby>
			);
		},
		s: (props: StyledIntrinsicsDict["s"]) => {
			const { children, ...rest } = props;
			return (
				<s
					{...{
						...rest,
						...topProp.themedComponentDict?.s,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</s>
			);
		},
		samp: (props: StyledIntrinsicsDict["samp"]) => {
			const { children, ...rest } = props;
			return (
				<samp
					{...{
						...rest,
						...topProp.themedComponentDict?.samp,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</samp>
			);
		},
		script: (props: StyledIntrinsicsDict["script"]) => {
			const { children, ...rest } = props;
			return (
				<script
					{...{
						...rest,
						...topProp.themedComponentDict?.script,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</script>
			);
		},
		section: (props: StyledIntrinsicsDict["section"]) => {
			const { children, ...rest } = props;
			return (
				<section
					{...{
						...rest,
						...topProp.themedComponentDict?.section,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</section>
			);
		},
		select: (props: StyledIntrinsicsDict["select"]) => {
			const { children, ...rest } = props;
			return (
				<select
					{...{
						...rest,
						...topProp.themedComponentDict?.select,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</select>
			);
		},
		slot: (props: StyledIntrinsicsDict["slot"]) => {
			const { children, ...rest } = props;
			return (
				<slot
					{...{
						...rest,
						...topProp.themedComponentDict?.slot,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</slot>
			);
		},
		small: (props: StyledIntrinsicsDict["small"]) => {
			const { children, ...rest } = props;
			return (
				<small
					{...{
						...rest,
						...topProp.themedComponentDict?.small,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</small>
			);
		},
		source: (props: StyledIntrinsicsDict["source"]) => {
			const { children, ...rest } = props;
			return (
				<source
					{...{
						...rest,
						...topProp.themedComponentDict?.source,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</source>
			);
		},
		span: (props: StyledIntrinsicsDict["span"]) => {
			const { children, ...rest } = props;
			return (
				<span
					{...{
						...rest,
						...topProp.themedComponentDict?.span,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</span>
			);
		},
		strong: (props: StyledIntrinsicsDict["strong"]) => {
			const { children, ...rest } = props;
			return (
				<strong
					{...{
						...rest,
						...topProp.themedComponentDict?.strong,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</strong>
			);
		},
		style: (props: StyledIntrinsicsDict["style"]) => {
			const { children, ...rest } = props;
			return (
				<style
					{...{
						...rest,
						...topProp.themedComponentDict?.style,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</style>
			);
		},
		sub: (props: StyledIntrinsicsDict["sub"]) => {
			const { children, ...rest } = props;
			return (
				<sub
					{...{
						...rest,
						...topProp.themedComponentDict?.sub,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</sub>
			);
		},
		summary: (props: StyledIntrinsicsDict["summary"]) => {
			const { children, ...rest } = props;
			return (
				<summary
					{...{
						...rest,
						...topProp.themedComponentDict?.summary,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</summary>
			);
		},
		sup: (props: StyledIntrinsicsDict["sup"]) => {
			const { children, ...rest } = props;
			return (
				<sup
					{...{
						...rest,
						...topProp.themedComponentDict?.sup,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</sup>
			);
		},
		table: (props: StyledIntrinsicsDict["table"]) => {
			const { children, ...rest } = props;
			return (
				<table
					{...{
						...rest,
						...topProp.themedComponentDict?.table,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</table>
			);
		},
		tbody: (props: StyledIntrinsicsDict["tbody"]) => {
			const { children, ...rest } = props;
			return (
				<tbody
					{...{
						...rest,
						...topProp.themedComponentDict?.tbody,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</tbody>
			);
		},
		td: (props: StyledIntrinsicsDict["td"]) => {
			const { children, ...rest } = props;
			return (
				<td
					{...{
						...rest,
						...topProp.themedComponentDict?.td,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</td>
			);
		},
		textarea: (props: StyledIntrinsicsDict["textarea"]) => {
			const { children, ...rest } = props;
			return (
				<textarea
					{...{
						...rest,
						...topProp.themedComponentDict?.textarea,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</textarea>
			);
		},
		tfoot: (props: StyledIntrinsicsDict["tfoot"]) => {
			const { children, ...rest } = props;
			return (
				<tfoot
					{...{
						...rest,
						...topProp.themedComponentDict?.tfoot,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</tfoot>
			);
		},
		th: (props: StyledIntrinsicsDict["th"]) => {
			const { children, ...rest } = props;
			return (
				<th
					{...{
						...rest,
						...topProp.themedComponentDict?.th,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</th>
			);
		},
		thead: (props: StyledIntrinsicsDict["thead"]) => {
			const { children, ...rest } = props;
			return (
				<thead
					{...{
						...rest,
						...topProp.themedComponentDict?.thead,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</thead>
			);
		},
		time: (props: StyledIntrinsicsDict["time"]) => {
			const { children, ...rest } = props;
			return (
				<time
					{...{
						...rest,
						...topProp.themedComponentDict?.time,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</time>
			);
		},
		title: (props: StyledIntrinsicsDict["title"]) => {
			const { children, ...rest } = props;
			return (
				<title
					{...{
						...rest,
						...topProp.themedComponentDict?.title,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</title>
			);
		},
		tr: (props: StyledIntrinsicsDict["tr"]) => {
			const { children, ...rest } = props;
			return (
				<tr
					{...{
						...rest,
						...topProp.themedComponentDict?.tr,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</tr>
			);
		},
		track: (props: StyledIntrinsicsDict["track"]) => {
			const { children, ...rest } = props;
			return (
				<track
					{...{
						...rest,
						...topProp.themedComponentDict?.track,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</track>
			);
		},
		u: (props: StyledIntrinsicsDict["u"]) => {
			const { children, ...rest } = props;
			return (
				<u
					{...{
						...rest,
						...topProp.themedComponentDict?.u,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</u>
			);
		},
		ul: (props: StyledIntrinsicsDict["ul"]) => {
			const { children, ...rest } = props;
			return (
				<ul
					{...{
						...rest,
						...topProp.themedComponentDict?.ul,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</ul>
			);
		},
		var: (props: StyledIntrinsicsDict["var"]) => {
			const { children, ...rest } = props;
			return (
				<var
					{...{
						...rest,
						...topProp.themedComponentDict?.var,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</var>
			);
		},
		video: (props: StyledIntrinsicsDict["video"]) => {
			const { children, ...rest } = props;
			return (
				<video
					{...{
						...rest,
						...topProp.themedComponentDict?.video,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</video>
			);
		},
		wbr: (props: StyledIntrinsicsDict["wbr"]) => {
			const { children, ...rest } = props;
			return (
				<wbr
					{...{
						...rest,
						...topProp.themedComponentDict?.wbr,
						class: rest.replaceWithClass ?? `${topProp.commonThemeCSS} ${rest.addClass.join(" ")}`,
					}}
				>
					{props.children}
				</wbr>
			);
		},
		// //SVG
		// svg: SVGAttributes<SVGSVGElement>;
		// animate: SVGAttributes<SVGAnimateElement>;
		// circle: SVGAttributes<SVGCircleElement>;
		// animateMotion: SVGAttributes<SVGAnimateMotionElement>;
		// animateTransform: SVGAttributes<SVGAnimateTransformElement>;
		// clipPath: SVGAttributes<SVGClipPathElement>;
		// defs: SVGAttributes<SVGDefsElement>;
		// desc: SVGAttributes<SVGDescElement>;
		// ellipse: SVGAttributes<SVGEllipseElement>;
		// feBlend: SVGAttributes<SVGFEBlendElement>;
		// feColorMatrix: SVGAttributes<SVGFEColorMatrixElement>;
		// feComponentTransfer: SVGAttributes<SVGFEComponentTransferElement>;
		// feComposite: SVGAttributes<SVGFECompositeElement>;
		// feConvolveMatrix: SVGAttributes<SVGFEConvolveMatrixElement>;
		// feDiffuseLighting: SVGAttributes<SVGFEDiffuseLightingElement>;
		// feDisplacementMap: SVGAttributes<SVGFEDisplacementMapElement>;
		// feDistantLight: SVGAttributes<SVGFEDistantLightElement>;
		// feDropShadow: SVGAttributes<SVGFEDropShadowElement>;
		// feFlood: SVGAttributes<SVGFEFloodElement>;
		// feFuncA: SVGAttributes<SVGFEFuncAElement>;
		// feFuncB: SVGAttributes<SVGFEFuncBElement>;
		// feFuncG: SVGAttributes<SVGFEFuncGElement>;
		// feFuncR: SVGAttributes<SVGFEFuncRElement>;
		// feGaussianBlur: SVGAttributes<SVGFEGaussianBlurElement>;
		// feImage: SVGAttributes<SVGFEImageElement>;
		// feMerge: SVGAttributes<SVGFEMergeElement>;
		// feMergeNode: SVGAttributes<SVGFEMergeNodeElement>;
		// feMorphology: SVGAttributes<SVGFEMorphologyElement>;
		// feOffset: SVGAttributes<SVGFEOffsetElement>;
		// fePointLight: SVGAttributes<SVGFEPointLightElement>;
		// feSpecularLighting: SVGAttributes<SVGFESpecularLightingElement>;
		// feSpotLight: SVGAttributes<SVGFESpotLightElement>;
		// feTile: SVGAttributes<SVGFETileElement>;
		// feTurbulence: SVGAttributes<SVGFETurbulenceElement>;
		// filter: SVGAttributes<SVGFilterElement>;
		// foreignObject: SVGAttributes<SVGForeignObjectElement>;
		// g: SVGAttributes<SVGGElement>;
		// image: SVGAttributes<SVGImageElement>;
		// line: SVGAttributes<SVGLineElement>;
		// linearGradient: SVGAttributes<SVGLinearGradientElement>;
		// marker: SVGAttributes<SVGMarkerElement>;
		// mask: SVGAttributes<SVGMaskElement>;
		// metadata: SVGAttributes<SVGMetadataElement>;
		// mpath: SVGAttributes<SVGMPathElement>;
		// path: SVGAttributes<SVGPathElement>;
		// pattern: SVGAttributes<SVGPatternElement>;
		// polygon: SVGAttributes<SVGPolygonElement>;
		// polyline: SVGAttributes<SVGPolylineElement>;
		// radialGradient: SVGAttributes<SVGRadialGradientElement>;
		// rect: SVGAttributes<SVGRectElement>;
		// set: SVGAttributes<SVGSetElement>;
		// stop: SVGAttributes<SVGStopElement>;
		// switch: SVGAttributes<SVGSwitchElement>;
		// symbol: SVGAttributes<SVGSymbolElement>;
		// text: SVGAttributes<SVGTextElement>;
		// textPath: SVGAttributes<SVGTextPathElement>;
		// tspan: SVGAttributes<SVGTSpanElement>;
		// use: SVGAttributes<SVGUseElement>;
		// view: SVGAttributes<SVGViewElement>;
	};
};
export default components;
