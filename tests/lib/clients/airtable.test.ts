import { assert } from "$std/testing/asserts.ts";
import { _handleNestedRecords, _handleRecords, airtable, AND, OR } from "$lib/clients/airtable.ts";

import envVarReader from "$lib/utils/vars.ts";
const envVar = await envVarReader();
const env = await envVar("MISSING");

const [apiToken, baseId, tableName] = [
	env("AIRTABLE_TOKEN"),
	env("AIRTABLE_BASE"),
	env("AIRTABLE_TABLE"),
];

const air = airtable({ apiToken, baseId, tableName });

Deno.test(`LIST URL`, () => {
	const u = air.LIST().url();
	assert(u.origin === "https://api.airtable.com");
	assert(u.pathname.includes(`/v0/${baseId}/${tableName}`));
});

Deno.test(`LIST REQ`, () => {
	const req = air.LIST().req();
	// console.log(33, req)
	assert(req.url.includes(`https://api.airtable.com/v0/${baseId}/${tableName}`));
	assert(req.headers.get("authorization")?.includes("Bearer"));
	assert(req.headers.get("authorization")?.includes(apiToken));
});

Deno.test(`LIST with query strings -REQ.1`, () => {
	const email = "dm@ericdm.com";
	const req = air.LIST({
		filterByFormula: `{Email}="${email}"`,
		sort: ["Status"],
	}).req();
	const u = new URL(req.url);

	// console.log([...u.searchParams.entries()])
	assert(req.headers.get("authorization")?.includes("Bearer"));
	assert(req.headers.get("authorization")?.includes(apiToken));

	assert(u.origin === "https://api.airtable.com");
	assert(u.pathname === `/v0/${baseId}/${tableName}`);
	// console.log(u.searchParams.get('filterByFormula'))
	assert(u.searchParams.get("filterByFormula") === `{Email}="${email}"`);
	assert(u.searchParams.get("sort[0][field]") === "Status");
});

Deno.test({
	name: "LIST with query strings -REQ.2",
	// make changes to the test so that the filterByFormula uses a Record of Key = Value Pairs
	fn: () => {
		const email = "dm@ericdm.com";
		const req = air.LIST({
			filterByFormula: `{Email}="${email}"`,
			sort: ["Status"],
		}).req();
		const u = new URL(req.url);

		// console.log([...u.searchParams.entries()])
		assert(req.headers.get("authorization")?.includes("Bearer"));
		assert(req.headers.get("authorization")?.includes(apiToken));

		assert(u.origin === "https://api.airtable.com");
		assert(u.pathname === `/v0/${baseId}/${tableName}`);
		// console.log(u.searchParams.get('filterByFormula'))
		// console.log(u.searchParams.get('sort'))
		assert(u.searchParams.get("filterByFormula") === `{Email}="${email}"`);
		assert(u.searchParams.get("sort[0][field]") === "Status");
	},
});

Deno.test(`LIST with query strings :NET`, async () => {
	const email = "dm@ericdm.com";
	const filterByFormula = `{Email}="${email}"`;
	const sort = [{ field: "Status", direction: "asc" as "asc" | "desc" }];

	const data = await air.LIST({
		filterByFormula,
		sort,
	})
		.json()
		.catch((e) => {
			console.error(e);
			return { records: [] };
		});

	// const u = air.LIST({
	// 	filterByFormula,
	// 	sort
	// }).url();
	//
	// console.log(u.href.slice(u.href.search("filterByFormula")), "\n", data);
	// console.log(u, [...u.searchParams.entries()], data);

	assert(!("error" in data));
	assert("records" in data);
	assert(data.records.length === 1);
	assert(data.records[0].fields.Email === email);
});

Deno.test(`LIST NET:JSON + GET NET:JSON`, async () => {
	const recordSet = await air.LIST().json();
	// console.log(41, {data: recordSet})

	assert(recordSet);
	assert(recordSet.records);
	assert(recordSet.records.length >= 2);

	await Promise.all(
		recordSet.records.map(async (record) => {
			const singleRecord = await air
				.GET({ recordId: record.id })
				.json()
				.catch((e) => {
					console.error(e);
					return { id: "" };
				});
			assert(singleRecord && recordSet.records.map((rec) => rec.id).includes(singleRecord.id));
		}),
	);
});

Deno.test(`LIST Response`, async () => {
	const res = await air.LIST().fetch();
	assert(res.ok);
	assert(res.status === 200);
	res.body?.cancel();
});

const recordId = "recgyYUNY0hP3ZIgm";
Deno.test(`GET Req`, async () => {
	const r = await air.GET({ recordId }).req();
	assert(r.url.includes(`https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`));
	assert(r.headers.get("authorization")?.includes("Bearer"));
	assert(r.headers.get("authorization")?.includes(apiToken));
});

Deno.test(`GET URL`, async () => {
	const u = await air.GET({ recordId }).url();
	assert(u.href.includes(`https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`));
});

Deno.test(`GET NET:Response`, async () => {
	const res = await air.GET({ recordId }).fetch();
	assert(res.ok);
	assert(res.status === 200);
	res.body?.cancel();
});

Deno.test(`GET NET:Dat`, async () => {
	const data = await air.GET({ recordId }).json();
	assert(data.id);
	assert(data.fields);
	assert(data.fields.Status);
	assert(data.fields.Email);
	assert(data.createdTime);
});

Deno.test("CREATE 1Row Req", async () => {
	const r = await air.CREATE(
		{ Email: "dummyData@notReal.com", Status: "test" },
	).req();

	const body = await r.json();

	assert(r.method === "POST");
	assert(body);

	assert(body.fields);
	assert(r.url.includes(`https://api.airtable.com/v0/${baseId}/${tableName}`));
	assert(r.headers.get("authorization")?.includes("Bearer"));
	assert(r.headers.get("authorization")?.includes(apiToken));
});

Deno.test("CREATE Req Multi Row", async () => {
	const r = await air.CREATE(
		{ Email: "dum1@notReal.com", Status: "test" },
		{ Email: "dum2@notReal.com", Status: "test" },
	).req();
	const body = await r.json();

	assert(r.method === "POST");
	assert(body);
	assert(body.records);
	assert(body.records[0].fields);
	assert(body.records[1].fields);
	assert(r.url.includes(`https://api.airtable.com/v0/${baseId}/${tableName}`));
	assert(r.headers.get("authorization")?.includes("Bearer"));
	assert(r.headers.get("authorization")?.includes(apiToken));
});

Deno.test(`CREATE URL`, async () => {
	const u = await air.CREATE({ Email: "test1@unittest.com", Status: "test" }).url();
	assert(u.href.includes(`https://api.airtable.com/v0/${baseId}/${tableName}`));
});

Deno.test({
	name: "CREATE:Net + UPDATE:Net + DELETE:Net",
	fn: async () => {
		const makeThese = [
			{ Email: "t10@testing.com", Status: "test" },
			{ Email: "t20@testing.com", Status: "test" },
		];
		const addedRecords = await air.CREATE(...makeThese).json();
		// console.log(123, "addedRecords:", addedRecords);

		const updatedData = await air.UPDATE({
			performUpsert: { fieldsToMergeOn: ["Email"] },
			records: makeThese.map((r) => ({ fields: { ...r, Status: "deleteMe" } })),
		}).json();
		// console.log(129, "updatedData:", updatedData);

		const deletedData = await air.DELETE(
			...addedRecords.records.map((r) => r.id),
			...updatedData.createdRecords,
		).json();
		// console.log(220, "deletedData:", deletedData);

		assert(addedRecords);
		assert(updatedData);
		assert(deletedData);
	},
});

Deno.test("CREATE:Json + UPDATE:Json + DELETE:Json", async () => {
	const makeThisSet = [
		{ Email: "t1@test.com", Status: "test" },
		{ Email: "t2@test.com", Status: "test" },
		{ Email: "t3@test.com", Status: "test" },
	];
	const createData = await air.CREATE(...makeThisSet).json();
	// console.log({ createData });

	assert(createData);
	assert(createData.records);
	assert(createData.records.length === makeThisSet.length);
	assert(createData.records[0].id);
	assert(createData.records[0].fields);
	assert(createData.records[0].createdTime);
	assert(createData.records[0].fields.Email === makeThisSet[0].Email);
	assert(createData.records[0].fields.Status === makeThisSet[0].Status);

	const updateData = await air.UPDATE({
		// performUpsert: { fieldsToMergeOn:['id'] },
		records: createData.records
			.map((r) => {
				const { id, fields } = r;
				// deno-lint-ignore no-unused-vars
				const { Created, "Last Modified": LastModified, ...userFields } = fields;
				return {
					id,
					fields: {
						...userFields,
						Email: `updated_${userFields.Email}`,
					},
				};
			}),
	}).json();
	// console.log({ updateData });

	assert(updateData.records[0].id);
	assert(updateData.records[0].fields);
	assert(updateData.records[0].createdTime);
	assert(updateData.records[0].fields.Status === makeThisSet[0].Status);
	assert(updateData.records[0].fields.Email !== makeThisSet[0].Email);

	const deleteData = await air.DELETE(...createData.records.map((r) => r.id)).json();
	// console.log({ deleteData });

	assert(deleteData.records.length === makeThisSet.length);
	assert(deleteData.records.map((d) => d.id).includes(createData.records[0].id));
	assert(deleteData.records.map((d) => d.id).includes(createData.records[1].id));
	assert(deleteData.records.map((d) => d.id).includes(createData.records[2].id));
});

Deno.test(`UPDATE Req`, async () => {
	const req = await air.UPDATE({
		performUpsert: { fieldsToMergeOn: ["Email"] },
		records: [{ fields: { Email: "tupdate@req.com", Status: "updatedtest" } }],
	}).req();

	const reqBody = await req.text();
	assert(reqBody);
	assert(JSON.parse(reqBody));
	assert(req.method === "PUT");
	assert(req.headers.get("authorization")?.includes("Bearer"));
	assert(req.headers.get("authorization")?.includes(apiToken));
	assert(req.url.includes(`https://api.airtable.com/v0/${baseId}/${tableName}`));
});

Deno.test(`UPDATE URL`, async () => {
	const url = await air.UPDATE(
		{
			records: [
				{ fields: { Email: "ab@cd.ef", Status: "test" } },
			],
		},
	).url();
	assert(url.href.includes(`https://api.airtable.com/v0/${baseId}/${tableName}`));
});

Deno.test(`DELETE Req`, async () => {
	const req = await air.DELETE("abc", "def").req();
	assert(req.method === "DELETE");
	assert(req.url.includes(`https://api.airtable.com/v0/${baseId}/${tableName}`));
	assert(req.url.includes(`?records=abc&records=def`));
});

Deno.test(`DELETE URL`, async () => {
	const url = await air.DELETE("abc", "def").url();
	assert(url.href.includes(`https://api.airtable.com/v0/${baseId}/${tableName}`));
});

Deno.test("Make AND filter By hand with trailing Underscore", () => {
	const s = _handleNestedRecords(
		{ AND_: { Status: "test", Email: "my@eail.com" } },
	);
	assert(s === `AND({Status}="test",{Email}="my@eail.com")`);
});

Deno.test("Make OR filter By hand with trailing Underscore", () => {
	const s = _handleNestedRecords({ OR_: { Status: "test", Email: "my@eail.com" } });
	assert(s === `OR({Status}="test",{Email}="my@eail.com")`);
});

Deno.test("Make AND with nested OR using builder func", () => {
	const s = _handleNestedRecords(AND({ Status: "waiting", OR_: { Email: "this" } }));
	assert(s === `AND({Status}="waiting",OR({Email}="this"))`);
});

Deno.test("Nested  AND/OR using Build Funcs", () => {
	const s = _handleNestedRecords(AND({ Status: "waiting", ...OR({ Email: "this" }) }));
	assert(s === `AND({Status}="waiting",OR({Email}="this"))`);
});

Deno.test("Build OR filter using the function builder", () => {
	const s = _handleNestedRecords(
		OR({
			Status: "waiting",
			Email: "this",
		}),
	);
	assert(s === `OR({Status}="waiting",{Email}="this")`);
});

Deno.test("FilterByFormula Nested Builder.4", () => {
	const s = _handleNestedRecords(
		OR({
			"Status=": "waiting",
			"Email=": "this",
		}),
	);
	assert(s === `OR({Status}="waiting",{Email}="this")`);
});

Deno.test("FilterByFormula Nested Builder.5", () => {
	const s = _handleNestedRecords(
		OR({
			"Status>": "waiting",
			"Status>=": "waiting",
			"Email<": "this",
			"Email<=": "this",
		}),
	);
	// console.log(s);
	assert(s === `OR({Status}>"waiting",{Status}>="waiting",{Email}<"this",{Email}<="this")`);
});

// Deno.test('DELETE JSON',async () => {
//     const deleteMe = [
//         "recQ6XD0dC1LyM1bf",
//         "recHEvRlUFQYbOq3y",
//         "recYvTiuPD5ctncM4",
//     ]

//     const deletedData = await AIR.DELETE(...deleteMe).json()
//     console.log(deletedData)
//     assert(deletedData)
//     assert(deletedData.records.length === deleteMe.length)
//     assert(deletedData.records.filter(r=>r.deleted).length === deleteMe.length)
// })
