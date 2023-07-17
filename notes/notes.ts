(() => {
	const _arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	const u = new URL(
		"https://ericdmoore.com?utm_source=twitter1&utm_source=twitter2&utm_campaign=ericdmoore&utm_medium=social",
	);
	console.log(Object.fromEntries(u.searchParams.entries()));

	// for (const v of arr){
	//     const c = 1000 - v * 100
	//     const t = performance.now()
	//     console.log({v,c, t})
	//     await new Promise((resolve, _reject) => setTimeout( () => resolve(c), c))
	//     console.log({v,c, duration: performance.now()-t})
	// }

	console.log("done");
})();
