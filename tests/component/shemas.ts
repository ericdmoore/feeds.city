import S from "fluentSchema";
import type * as Stypes from "fluentSchema";
// import type { fluentSchema as flusch}  from "fluentSchema";

// import { , S } from "fluentSchema";

const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const Address = S.object()
  .prop("line1", S.anyOf([S.string(), S.null()]).required()) // JSON Schema nullable
  .prop("line2", S.string().raw({ nullable: true })) // Open API / Swagger  nullable
  .prop("country", S.string().required())
  .prop("city", S.string().required())
  .prop("zipcode", S.string().required());

export const simpleUser = S.object()
  .id("http://example.info/user")
  .title("My First Fluent JSON Schema")
  .description("A simple user")
  .prop("email", S.string().format(S.FORMATS.EMAIL).required())
  .prop("password", S.string().minLength(8).required())
  .prop("role", S.string().enum(Object.values(ROLES)).default(ROLES.USER))
  .prop(
    "birthday",
    S.string().format("date").raw({ formatMaximum: "2020-01-01" }),
  ) // formatMaximum is an AJV custom keywords
  .prop("address", S.ref("#address"))
  .definition("address", Address.id("#address"));

const _extending = (
  base: Stypes.ObjectSchema,
  _extensionItem: Stypes.ObjectSchema,
): Stypes.ObjectSchema => {
  // console.log(base, extensionItem);
  const baseSchema = base.valueOf();

  // merge properties
  // merge required props
  // any conflicts, yield to specfic overrides

  return S.object().raw(baseSchema);
};

export const URL = S.string().format("url");
export const Text = S.string();

export const TextOrURL = S.anyOf([Text, URL]);
export const Date = S.string().format("date");
export const DateTime = S.string().format("date-time");
export const DateOrDateTime = S.anyOf([Date, DateTime]);

export const EmailMessage = S.object();
export const ContactPoint = S.object();
export const Organization = S.object();
export const Person = S.object();
export const Audience = S.object(); // https://schema.org/Audience

export const Thing = S.object()
  .id("https://json.schemastore.org/schema-org-thing.json")
  .prop(
    "additionalType",
    S.string().description(`An additional typeID for the item`),
  )
  .prop("alternateName", S.string().description(`An alias for the item.`))
  .prop(
    "identifier",
    S.string().description(
      `The identifier property represents any kind of identifier for any kind of Thing, such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See background notes for more details.`,
    ),
  )
  .prop("description", S.string().description("A description of the item."))
  .prop(
    "disambiguatingDescription",
    S.string().description(
      `A sub property of description. A short description of the item used to disambiguate from other, similar items. Information from other properties (in particular, name) may be necessary for the description to be useful for disambiguation.`,
    ),
  )
  .prop(
    "image",
    S.string().description(
      "An image of the item. This can be a URL or a fully described ImageObject.",
    ),
  )
  .prop(
    "mainEntityOfPage",
    S.string().description(
      `Indicates a page (or other CreativeWork) for which this thing is the main entity being described. See background notes for details. Inverse property: mainEntity`,
    ),
  )
  .prop("name", S.string().description("The name of the item."))
  .prop(
    "potentialAction",
    S.string().description(
      `Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.`,
    ),
  ) // 	Action
  .prop(
    "sameAs",
    S.string().description(
      `URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Wikidata entry, or official website.`,
    ),
  )
  .prop(
    "subjectOf",
    S.anyOf([S.ref("#")]).description(
      "A CreativeWork or Event about this Thing. Inverse property: about",
    ),
  )
  .prop("url", S.string().description("URL of the item"));

export const CreativeWork = S.object()
  .id("https://schema.org/CreativeWork")
  .prop(
    "about",
    Thing.description(
      `The subject matter of the content. Inverse property: subjectOf`,
    ),
  )
  .prop(
    "abstract",
    S.string().description(
      `An abstract is a short description that summarizes a CreativeWork.`,
    ),
  )
  .prop(
    "accessMode",
    S.string().description(
      `The human sensory perceptual system or cognitive faculty through which a person may process or perceive information. Values should be drawn from the approved vocabulary.`,
    ),
  )
  .prop(
    "accessModeSufficient",
    S.string().description(
      ` ItemList A list of single or combined accessModes that are sufficient to understand all the intellectual content of a resource. Values should be drawn from the approved vocabulary.`,
    ),
  )
  .prop(
    "accessibilityAPI",
    S.string().description(
      `Indicates that the resource is compatible with the referenced accessibility API. Values should be drawn from the approved vocabulary.`,
    ),
  )
  .prop(
    "accessibilityControl",
    S.string().description(
      `Identifies input methods that are sufficient to fully control the described resource. Values should be drawn from the approved vocabulary.`,
    ),
  )
  .prop(
    "accessibilityFeature",
    S.string().description(
      `Content features of the resource, such as accessible media, alternatives and supported enhancements for accessibility. Values should be drawn from the approved vocabulary.`,
    ),
  )
  .prop(
    "accessibilityHazard",
    S.string().description(
      `A characteristic of the described resource that is physiologically dangerous to some users. Related to WCAG 2.0 guideline 2.3. Values should be drawn from the approved vocabulary.`,
    ),
  )
  .prop(
    "accessibilitySummary",
    S.string().description(
      `A human-readable summary of specific accessibility features or deficiencies, consistent with the other accessibility metadata but expressing subtleties such as "short descriptions are present but long descriptions will be needed for non-visual users" or "short descriptions are present and no long descriptions are needed."`,
    ),
  )
  .prop(
    "accountablePerson",
    Person.description(
      `Specifies the Person that is legally accountable for the CreativeWork.`,
    ),
  )
  .prop(
    "acquireLicensePage",
    URL.description(
      `URL: Indicates a page documenting how licenses can be purchased or otherwise acquired, for the current item.`,
    ),
  )
  // .prop('aggregateRating', S.string().description(` 	AggregateRating 	The overall rating, based on a collection of reviews or ratings, of the item.`))
  .prop(
    "alternativeHeadline",
    S.string().description(`A secondary title of the CreativeWork.`),
  )
  .prop(
    "archivedAt",
    URL.description(
      `Indicates a page or other link involved in archival of a CreativeWork. In the case of MediaReview, the items in a MediaReviewItem may often become inaccessible, but be archived by archival, journalistic, activist, or law enforcement organizations. In such cases, the referenced page may not directly publish the content.`,
    ),
  )
  .prop(
    "assesses",
    S.string().description(
      `DefinedTerm  or Text 	The item being described is intended to assess the competency or learning outcome defined by the referenced term.`,
    ),
  )
  .prop(
    "associatedMedia",
    S.string().description(
      `MediaObject 	A media object that encodes this CreativeWork. This property is a synonym for encoding.`,
    ),
  )
  .prop(
    "audience",
    Audience.description(
      `An intended audience, i.e. a group for whom something was created. Supersedes serviceAudience.`,
    ),
  )
  .prop(
    "audio",
    S.string().description(
      `AudioObject  or Clip  or MusicRecording 	An embedded audio object.`,
    ),
  )
  .prop(
    "author",
    S.anyOf([Organization, Person]).description(
      `The author of this content or rating. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably.`,
    ),
  )
  .prop(
    "award",
    S.string().description(
      `An award won by or for this item. Supersedes awards.`,
    ),
  )
  .prop(
    "character",
    Person.description(`Fictional person connected with a creative work.`),
  )
  .prop(
    "citation",
    S.anyOf([S.ref("#"), Text]).description(
      `A citation or reference to another creative work, such as another publication, web page, scholarly article, etc.`,
    ),
  )
  .prop(
    "comment",
    S.string().description(` 	Comment 	Comments, typically from users.`),
  )
  .prop(
    "commentCount",
    S.string().description(
      ` 	Integer 	The number of comments this CreativeWork (e.g. Article, Question or Answer) has received. This is most applicable to works published in Web sites with commenting system; additional comments may exist elsewhere.`,
    ),
  )
  .prop(
    "conditionsOfAccess",
    S.string().description(
      `Conditions that affect the availability of, or method(s) of access to, an item. Typically used for real world items such as an ArchiveComponent held by an ArchiveOrganization. This property is not suitable for use as a general Web access control mechanism. It is expressed only in natural language. For example "Available by appointment from the Reading Room" or "Accessible only from logged-in accounts ".`,
    ),
  )
  .prop(
    "contentLocation",
    S.string().description(
      ` Place 	The location depicted or described in the content. For example, the location in a photograph or painting.`,
    ),
  )
  .prop(
    "contentRating",
    S.string().description(
      `Rating  or Text 	Official rating of a piece of content—for example,'MPAA PG-13'.`,
    ),
  )
  .prop(
    "contentReferenceTime",
    S.string().description(
      ` 	DateTime 	The specific time described by a creative work, for works (e.g. articles, video objects etc.) that emphasise a particular moment within an Event.`,
    ),
  )
  .prop(
    "contributor",
    S.anyOf([Organization, Person]).description(
      `A secondary contributor to the CreativeWork or Event.`,
    ),
  )
  .prop(
    "copyrightHolder",
    S.anyOf([Organization, Person]).description(
      `The party holding the legal copyright to the CreativeWork.`,
    ),
  )
  .prop(
    "copyrightNotice",
    S.string().description(
      `Text of a notice appropriate for describing the copyright aspects of this Creative Work, ideally indicating the owner of the copyright for the Work.`,
    ),
  )
  .prop(
    "copyrightYear",
    S.number().description(
      `The year during which the claimed copyright for the CreativeWork was first asserted.`,
    ),
  )
  .prop(
    "correction",
    S.string().description(
      `CorrectionComment  or Text  or URL 	Indicates a correction to a CreativeWork, either via a CorrectionComment, textually or in another document.`,
    ),
  )
  .prop(
    "countryOfOrigin",
    S.string().description(
      `Country 	The country of origin of something, including products as well as creative works such as movie and TV content. In the case of TV and movie, this would be the country of the principle offices of the production company or individual responsible for the movie. For other kinds of CreativeWork it is difficult to provide fully general guidance, and properties such as contentLocation and locationCreated may be more applicable. In the case of products, the country of origin of the product. The exact interpretation of this may vary by context and product type, and cannot be fully enumerated here.`,
    ),
  )
  .prop(
    "creativeWorkStatus",
    S.string().description(
      `The status of a creative work in terms of its stage in a lifecycle. Example terms include Incomplete, Draft, Published, Obsolete. Some organizations define a set of terms for the stages of their publication lifecycle.`,
    ),
  )
  .prop(
    "creator",
    S.anyOf([Organization, Person]).description(
      `The creator/author of this CreativeWork. This is the same as the Author property for CreativeWork.`,
    ),
  )
  .prop(
    "creditText",
    S.string().description(
      `Text that can be used to credit person(s) and/or organization(s) associated with a published Creative Work.`,
    ),
  )
  .prop(
    "dateCreated",
    DateOrDateTime.description(
      `The date on which the CreativeWork was created or the item was added to a DataFeed.`,
    ),
  )
  .prop(
    "dateModified",
    DateOrDateTime.description(
      `The date on which the CreativeWork was most recently modified or when the item's entry was modified within a DataFeed.`,
    ),
  )
  .prop(
    "datePublished",
    DateOrDateTime.description(`Date of first broadcast/publication.`),
  )
  .prop(
    "discussionUrl",
    URL.description(
      `A link to the page containing the comments of the CreativeWork.`,
    ),
  )
  .prop(
    "editEIDR",
    TextOrURL.description(
      `An EIDR (Entertainment Identifier Registry) identifier representing a specific edit / edition for a work of film or television. For example, the motion picture known as "Ghostbusters" whose titleEIDR is "10.5240/7EC7-228A-510A-053E-CBB8-J", has several edits e.g. "10.5240/1F2A-E1C5-680A-14C6-E76B-I" and "10.5240/8A35-3BEE-6497-5D12-9E4F-3". Since schema.org types like Movie and TVEpisode can be used for both works and their multiple expressions, it is possible to use titleEIDR alone (for a general description), or alongside editEIDR for a more edit-specific description.`,
    ),
  )
  .prop(
    "editor",
    Person.description(`Specifies the Person who edited the CreativeWork.`),
  )
  .prop(
    "educationalAlignment",
    S.string().description(
      `AlignmentObject 	An alignment to an established educational framework. This property should not be used where the nature of the alignment can be described using a simple property, for example to express that a resource teaches or assesses a competency.`,
    ),
  )
  .prop(
    "educationalLevel",
    TextOrURL.description(
      `The level in terms of progression through an educational or training context. Examples of educational levels include 'beginner', 'intermediate' or 'advanced', and formal sets of level indicators.`,
    ),
  )
  .prop(
    "educationalUse",
    S.string().description(
      `The purpose of a work in the context of education; for example, 'assignment', 'group work'.`,
    ),
  )
  .prop(
    "encoding",
    S.string().description(
      `MediaObject 	A media object that encodes this CreativeWork. This property is a synonym for associatedMedia. Supersedes encodings. Inverse property: encodesCreativeWork`,
    ),
  )
  .prop(
    "encodingFormat",
    TextOrURL.description(
      `Media type typically expressed using a MIME format (see IANA site and MDN reference) e.g. application/zip for a SoftwareApplication binary, audio/mpeg for .mp3 etc.). In cases where a CreativeWork has several media type representations, encoding can be used to indicate each MediaObject alongside particular encodingFormat information. Unregistered or niche encoding and file formats can be indicated instead via the most appropriate URL, e.g. defining Web page or a Wikipedia/Wikidata entry. Supersedes fileFormat.`,
    ),
  )
  .prop(
    "exampleOfWork",
    S.ref("#").description(
      `A creative work that this work is an example/instance/realization/derivation of. Inverse property: workExample`,
    ),
  )
  .prop(
    "expires",
    Date.description(
      `Date the content expires and is no longer useful or available. For example a VideoObject or NewsArticle whose availability or relevance is time-limited, or a ClaimReview fact check whose publisher wants to indicate that it may no longer be relevant (or helpful to highlight) after some date.`,
    ),
  )
  .prop(
    "funder",
    S.anyOf([Organization, Person]).description(
      `A person or organization that supports (sponsors) something through some kind of financial contribution.`,
    ),
  )
  .prop(
    "funding",
    S.string().description(
      ` Grant 	A Grant that directly or indirectly provide funding or sponsorship for this item. See also ownershipFundingInfo. Inverse property: fundedItem`,
    ),
  )
  .prop(
    "genre",
    S.anyOf([S.string(), URL]).description(
      `Genre of the creative work, broadcast channel or group.`,
    ),
  )
  .prop(
    "hasPart",
    S.ref("#").description(
      `Indicates an item or CreativeWork that is part of this item, or CreativeWork (in some sense). Inverse property: isPartOf`,
    ),
  )
  .prop("headline", S.string().description(`Headline of the article.`))
  .prop(
    "inLanguage",
    S.string().description(
      `The language of the content or performance or used in an action. Please use one of the language codes from the IETF BCP 47 standard. See also availableLanguage. Supersedes language.`,
    ),
  )
  .prop(
    "interactionStatistic",
    S.number().description(
      `The number of interactions for the CreativeWork using the WebSite or SoftwareApplication. The most specific child type of InteractionCounter should be used. Supersedes interactionCount.`,
    ),
  )
  .prop(
    "interactivityType",
    S.string().description(
      `The predominant mode of learning supported by the learning resource. Acceptable values are 'active', 'expositive', or 'mixed'.`,
    ),
  )
  .prop(
    "interpretedAsClaim",
    S.string().description(
      `Claim 	Used to indicate a specific claim contained, implied, translated or refined from the content of a MediaObject or other CreativeWork. The interpreting party can be indicated using claimInterpreter.`,
    ),
  )
  .prop(
    "isAccessibleForFree",
    S.boolean().description(
      `A flag to signal that the item, event, or place is accessible for free. Supersedes free.`,
    ),
  )
  .prop(
    "isBasedOn",
    S.anyOf([S.ref("#"), URL]).description(
      `A resource from which this work is derived or from which it is a modification or adaption. Supersedes isBasedOnUrl.`,
    ),
  )
  .prop(
    "isFamilyFriendly",
    S.boolean().description(
      `Indicates whether this content is family friendly.`,
    ),
  )
  .prop(
    "isPartOf",
    S.anyOf([S.ref("#"), URL]).description(
      ` 	CreativeWork  or URL 	Indicates an item or CreativeWork that this item, or CreativeWork (in some sense), is part of. Inverse property: hasPart`,
    ),
  )
  .prop(
    "keywords",
    TextOrURL.description(
      ` 	DefinedTerm  or Text  or URL 	Keywords or tags used to describe some item. Multiple textual entries in a keywords list are typically delimited by commas, or by repeating the property.`,
    ),
  )
  .prop(
    "learningResourceType",
    S.string().description(
      ` 	DefinedTerm  or Text 	The predominant type or kind characterizing the learning resource. For example, 'presentation', 'handout'.`,
    ),
  )
  .prop(
    "license",
    S.anyOf([S.ref("#"), URL]).description(
      ` 	CreativeWork  or URL 	A license document that applies to this content, typically indicated by URL.`,
    ),
  )
  .prop(
    "locationCreated",
    S.string().description(
      ` 	Place 	The location where the CreativeWork was created, which may not be the same as the location depicted in the CreativeWork.`,
    ),
  )
  /* * */ .prop(
    "mainEntity",
    Thing.description(
      `Indicates the primary entity described in some page or other CreativeWork. Inverse property: mainEntityOfPage`,
    ),
  )
  .prop(
    "maintainer",
    S.string().description(
      ` 	Organization  or Person 	A maintainer of a Dataset, software package (SoftwareApplication), or other Project. A maintainer is a Person or Organization that manages contributions to, and/or publication of, some (typically complex) artifact. It is common for distributions of software and data to be based on "upstream" sources. When maintainer is applied to a specific version of something e.g. a particular version or packaging of a Dataset, it is always possible that the upstream source has a different maintainer. The isBasedOn property can be used to indicate such relationships between datasets to make the different maintenance roles clear. Similarly in the case of software, a package may have dedicated maintainers working on integration into software distributions such as Ubuntu, as well as upstream maintainers of the underlying work.`,
    ),
  )
  .prop(
    "material",
    TextOrURL.description(
      ` 	Product  or Text  or URL 	A material that something is made from, e.g. leather, wool, cotton, paper.`,
    ),
  )
  .prop(
    "materialExtent",
    S.string().description(
      ` 	QuantitativeValue  or Text 	The quantity of the materials being described or an expression of the physical space they occupy.`,
    ),
  )
  .prop(
    "mentions",
    Thing.description(
      ` 	Thing 	Indicates that the CreativeWork contains a reference to, but is not necessarily about a concept.`,
    ),
  )
  .prop(
    "offers",
    S.string().description(
      ` 	Demand  or Offer 	An offer to provide this item—for example, an offer to sell a product, rent the DVD of a movie, perform a service, or give away tickets to an event. Use businessFunction to indicate the kind of transaction offered, i.e. sell, lease, etc. This property can also be used to describe a Demand. While this property is listed as expected on a number of common types, it can be used in others. In that case, using a second type, such as Product or a subtype of Product, can clarify the nature of the offer. Inverse property: itemOffered`,
    ),
  )
  .prop(
    "pattern",
    S.string().description(
      ` 	DefinedTerm  or Text 	A pattern that something has, for example 'polka dot', 'striped', 'Canadian flag'. Values are typically expressed as text, although links to controlled value schemes are also supported.`,
    ),
  )
  .prop(
    "position",
    S.string().description(
      ` 	Integer  or Text 	The position of an item in a series or sequence of items.`,
    ),
  )
  .prop(
    "producer",
    S.anyOf([Organization, Person]).description(
      `The person or organization who produced the work (e.g. music album, movie, tv/radio series etc.).`,
    ),
  )
  .prop(
    "provider",
    S.anyOf([Organization, Person]).description(
      `The service provider, service operator, or service performer; the goods producer. Another party (a seller) may offer those services or goods on behalf of the provider. A provider may also serve as the seller. Supersedes carrier.`,
    ),
  )
  .prop(
    "publication",
    S.string().description(
      ` 	PublicationEvent 	A publication event associated with the item.`,
    ),
  )
  .prop(
    "publisher",
    S.anyOf([Organization, Person]).description(
      ` 	Organization  or Person 	The publisher of the creative work.`,
    ),
  )
  .prop(
    "publisherImprint",
    S.string().description(
      ` 	Organization 	The publishing division which published the comic.`,
    ),
  )
  .prop(
    "publishingPrinciples",
    S.anyOf([S.ref("#"), URL]).description(
      ` 	CreativeWork  or URL 	The publishingPrinciples property indicates (typically via URL) a document describing the editorial principles of an Organization (or individual e.g. a Person writing a blog) that relate to their activities as a publisher, e.g. ethics or diversity policies. When applied to a CreativeWork (e.g. NewsArticle) the principles are those of the party primarily responsible for the creation of the CreativeWork. While such policies are most typically expressed in natural language, sometimes related information (e.g. indicating a funder) can be expressed using schema.org terminology.`,
    ),
  )
  .prop(
    "recordedAt",
    S.string().description(
      `Event 	The Event where the CreativeWork was recorded. The CreativeWork may capture all or part of the event. Inverse property: recordedIn`,
    ),
  )
  .prop(
    "releasedEvent",
    S.string().description(
      `PublicationEvent 	The place and time the release was issued, expressed as a PublicationEvent.`,
    ),
  )
  .prop(
    "review",
    S.string().description(
      `Review 	A review of the item. Supersedes reviews.`,
    ),
  )
  .prop(
    "schemaVersion",
    TextOrURL.description(
      ` 	Text  or URL 	Indicates (by URL or string) a particular version of a schema used in some CreativeWork. This property was created primarily to indicate the use of a specific schema.org release, e.g. 10.0 as a simple string, or more explicitly via URL, https://schema.org/docs/releases.html#v10.0. There may be situations in which other schemas might usefully be referenced this way, e.g. http://dublincore.org/specifications/dublin-core/dces/1999-07-02/ but this has not been carefully explored in the community.`,
    ),
  )
  .prop(
    "sdDatePublished",
    S.string().format("date").description(
      `Indicates the date on which the current structured data was generated / published. Typically used alongside sdPublisher`,
    ),
  )
  .prop(
    "sdLicense",
    S.anyOf([S.ref("#"), URL]).description(
      `A license document that applies to this structured data, typically indicated by URL.`,
    ),
  )
  .prop(
    "sdPublisher",
    S.anyOf([Organization, Person]).description(
      `Indicates the party responsible for generating and publishing the current structured data markup, typically in cases where the structured data is derived automatically from existing published content but published on a different site. For example, student projects and open data initiatives often re-publish existing content with more explicitly structured metadata. The sdPublisher property helps make such practices more explicit.`,
    ),
  )
  .prop(
    "size",
    S.string().description(
      ` 	DefinedTerm  or QuantitativeValue  or SizeSpecification  or Text 	A standardized size of a product or creative work, specified either through a simple textual string (for example 'XL', '32Wx34L'), a QuantitativeValue with a unitCode, or a comprehensive and structured SizeSpecification; in other cases, the width, height, depth and weight properties may be more applicable.`,
    ),
  )
  .prop(
    "sourceOrganization",
    S.string().description(
      ` 	Organization 	The Organization on whose behalf the creator was working.`,
    ),
  )
  .prop(
    "spatial",
    S.string().description(
      ` 	Place 	The "spatial" property can be used in cases when more specific properties (e.g. locationCreated, spatialCoverage, contentLocation) are not known to be appropriate.`,
    ),
  )
  .prop(
    "spatialCoverage",
    S.string().description(
      ` 	Place 	The spatialCoverage of a CreativeWork indicates the place(s) which are the focus of the content. It is a subproperty of contentLocation intended primarily for more technical and detailed materials. For example with a Dataset, it indicates areas that the dataset describes: a dataset of New York weather would have spatialCoverage which was the place: the state of New York.`,
    ),
  )
  .prop(
    "sponsor",
    S.anyOf([Organization, Person]).description(
      `A person or organization that supports a thing through a pledge, promise, or financial contribution. e.g. a sponsor of a Medical Study or a corporate sponsor of an event.`,
    ),
  )
  .prop(
    "teaches",
    S.string().description(
      `The item being described is intended to help a person learn the competency or learning outcome defined by the referenced term.`,
    ),
  )
  .prop(
    "temporal",
    S.anyOf([S.string(), S.string().format("date-time")]).description(
      `The "temporal" property can be used in cases where more specific properties (e.g. temporalCoverage, dateCreated, dateModified, datePublished) are not known to be appropriate.`,
    ),
  )
  .prop(
    "temporalCoverage",
    S.anyOf([
      S.string(),
      S.string().format("url"),
      S.string().format("date-time"),
    ]).description(
      ` 	DateTime  or Text  or URL 	The temporalCoverage of a CreativeWork indicates the period that the content applies to, i.e. that it describes, either as a DateTime or as a textual string indicating a time period in ISO 8601 time interval format. In the case of a Dataset it will typically indicate the relevant time period in a precise notation (e.g. for a 2011 census dataset, the year 2011 would be written "2011/2012"). Other forms of content e.g. ScholarlyArticle, Book, TVSeries or TVEpisode may indicate their temporalCoverage in broader terms - textually or via well-known URL. Written works such as books may sometimes have precise temporal coverage too, e.g. a work set in 1939 - 1945 can be indicated in ISO 8601 interval format format via "1939/1945". Open-ended date ranges can be written with ".." in place of the end date. For example, "2015-11/.." indicates a range beginning in November 2015 and with no specified final date. This is tentative and might be updated in future when ISO 8601 is officially updated. Supersedes datasetTimeInterval.`,
    ),
  )
  /* * */ .prop(
    "text",
    S.string().description(`The textual content of this CreativeWork.`),
  )
  .prop(
    "thumbnailUrl",
    URL.description(`URL: A thumbnail image relevant to the Thing.`),
  )
  .prop(
    "timeRequired",
    S.string().description(
      ` 	Duration 	Approximate or typical time it takes to work with or through this learning resource for the typical intended target audience, e.g. 'PT30M', 'PT1H25M'.`,
    ),
  )
  .prop(
    "translationOfWork",
    S.ref("#").description(
      `The work that this work has been translated from. e.g. 物种起源 is a translationOf “On the Origin of Species” Inverse property: workTranslation`,
    ),
  )
  .prop(
    "translator",
    S.anyOf([Organization, Person]).description(
      `Organization or person who adapts a creative work to different languages, regional differences and technical requirements of a target market, or that translates during some event.`,
    ),
  )
  .prop(
    "typicalAgeRange",
    S.string().description(
      `The typical expected age range, e.g. '7-9', '11-'.`,
    ),
  )
  .prop(
    "usageInfo",
    S.anyOf([URL, S.ref("#")]).description(
      `The schema.org usageInfo property indicates further information about a CreativeWork. This property is applicable both to works that are freely available and to those that require payment or other transactions. It can reference additional information e.g. community expectations on preferred linking and citation conventions, as well as purchasing details. For something that can be commercially licensed, usageInfo can provide detailed, resource-specific information about licensing options. This property can be used alongside the license property which indicates license(s) applicable to some piece of content. The usageInfo property can provide information about other licensing options, e.g. acquiring commercial usage rights for an image that is also available under non-commercial creative commons licenses.`,
    ),
  )
  .prop(
    "version",
    S.oneOf([S.number(), S.string()]).description(
      `The version of the CreativeWork embodied by a specified resource.`,
    ),
  )
  /* * */ .prop(
    "video",
    S.string().description(`Clip  or VideoObject 	An embedded video object.`),
  )
  .prop(
    "workExample",
    S.ref("#").description(
      `Example/instance/realization/derivation of the concept of this creative work. eg. The paperback edition, first edition, or eBook. Inverse property: exampleOfWork`,
    ),
  )
  .prop(
    "workTranslation",
    S.ref("#").description(
      `A work that is a translation of the content of this work. e.g. 西遊記 has an English workTranslation “Journey to the West”,a German workTranslation “Monkeys Pilgerfahrt” and a Vietnamese translation Tây du ký bình khảo. Inverse property: translationOfWork`,
    ),
  );

/*

fluent API = x
[x] compose functions
[x] - object, boolean, string, null, ...etc
[x] dependent composing functions
[x] - object.prop
[x] - object.id

[ ] processing functions
-----------------------------
[ ] - extending(base: schema)
[ ] - bundle()
[ ] - fromURL(url:string)

Type System:
-----------------------------
[ ] - offer a typed schema




Property	Expected Type	Description

https://schema.org/Action
Properties from Action
actionStatus 	ActionStatusType 	Indicates the current disposition of the Action.
agent 	Organization  or Person 	The direct performer or driver of the action (animate or inanimate). e.g. John wrote a book.
endTime 	DateTime  or Time 	The endTime of something. For a reserved event or service (e.g. FoodEstablishmentReservation), the time that it is expected to end. For actions that span a period of time, when the action was performed. e.g. John wrote a book from January to December. For media, including audio and video, it's the time offset of the end of a clip within a larger file. Note that Event uses startDate/endDate instead of startTime/endTime, even when describing dates with times. This situation may be clarified in future revisions.
error 	Thing 	For failed actions, more information on the cause of the failure.
instrument 	Thing 	The object that helped the agent perform the action. e.g. John wrote a book with a pen.
location 	Place  or PostalAddress  or Text  or VirtualLocation 	The location of, for example, where an event is happening, where an organization is located, or where an action takes place.
object 	Thing 	The object upon which the action is carried out, whose state is kept intact or changed. Also known as the semantic roles patient, affected or undergoer (which change their state) or theme (which doesn't). e.g. John read a book.
participant 	Organization  or Person 	Other co-agents that participated in the action indirectly. e.g. John wrote a book with Steve.
provider 	Organization  or Person 	The service provider, service operator, or service performer; the goods producer. Another party (a seller) may offer those services or goods on behalf of the provider. A provider may also serve as the seller. Supersedes carrier.
result 	Thing 	The result produced in the action. e.g. John wrote a book.
startTime 	DateTime  or Time 	The startTime of something. For a reserved event or service (e.g. FoodEstablishmentReservation), the time that it is expected to start. For actions that span a period of time, when the action was performed. e.g. John wrote a book from January to December. For media, including audio and video, it's the time offset of the start of a clip within a larger file. Note that Event uses startDate/endDate instead of startTime/endTime, even when describing dates with times. This situation may be clarified in future revisions.
target 	EntryPoint 	Indicates a target EntryPoint for an Action.

https://schema.org/Person
Properties from Person
additionalName 	Text 	An additional name for a Person, can be used for a middle name.
address 	PostalAddress  or Text 	Physical address of the item.
affiliation 	Organization 	An organization that this person is affiliated with. For example, a school/university, a club, or a team.
alumniOf 	EducationalOrganization  or Organization 	An organization that the person is an alumni of. Inverse property: alumni
award 	Text 	An award won by or for this item. Supersedes awards.
birthDate 	Date 	Date of birth.
birthPlace 	Place 	The place where the person was born.
brand 	Brand  or Organization 	The brand(s) associated with a product or service, or the brand(s) maintained by an organization or business person.
callSign 	Text 	A callsign, as used in broadcasting and radio communications to identify people, radio and TV stations, or vehicles.
children 	Person 	A child of the person.
colleague 	Person  or URL 	A colleague of the person. Supersedes colleagues.
contactPoint 	ContactPoint 	A contact point for a person or organization. Supersedes contactPoints.
deathDate 	Date 	Date of death.
deathPlace 	Place 	The place where the person died.
duns 	Text 	The Dun & Bradstreet DUNS number for identifying an organization or business person.
email 	Text 	Email address.
familyName 	Text 	Family name. In the U.S., the last name of a Person.
faxNumber 	Text 	The fax number.
follows 	Person 	The most generic uni-directional social relation.
funder 	Organization  or Person 	A person or organization that supports (sponsors) something through some kind of financial contribution.
funding 	Grant 	A Grant that directly or indirectly provide funding or sponsorship for this item. See also ownershipFundingInfo. Inverse property: fundedItem
gender 	GenderType  or Text 	Gender of something, typically a Person, but possibly also fictional characters, animals, etc. While https://schema.org/Male and https://schema.org/Female may be used, text strings are also acceptable for people who do not identify as a binary gender. The gender property can also be used in an extended sense to cover e.g. the gender of sports teams. As with the gender of individuals, we do not try to enumerate all possibilities. A mixed-gender SportsTeam can be indicated with a text value of "Mixed".
givenName 	Text 	Given name. In the U.S., the first name of a Person.
globalLocationNumber 	Text 	The Global Location Number (GLN, sometimes also referred to as International Location Number or ILN) of the respective organization, person, or place. The GLN is a 13-digit number used to identify parties and physical locations.
hasCredential 	EducationalOccupationalCredential 	A credential awarded to the Person or Organization.
hasOccupation 	Occupation 	The Person's occupation. For past professions, use Role for expressing dates.
hasOfferCatalog 	OfferCatalog 	Indicates an OfferCatalog listing for this Organization, Person, or Service.
hasPOS 	Place 	Points-of-Sales operated by the organization or person.
height 	Distance  or
QuantitativeValue 	The height of the item.
homeLocation 	ContactPoint  or Place 	A contact location for a person's residence.
honorificPrefix 	Text 	An honorific prefix preceding a Person's name such as Dr/Mrs/Mr.
honorificSuffix 	Text 	An honorific suffix following a Person's name such as M.D. /PhD/MSCSW.
interactionStatistic 	InteractionCounter 	The number of interactions for the CreativeWork using the WebSite or SoftwareApplication. The most specific child type of InteractionCounter should be used. Supersedes interactionCount.
isicV4 	Text 	The International Standard of Industrial Classification of All Economic Activities (ISIC), Revision 4 code for a particular organization, business person, or place.
jobTitle 	DefinedTerm  or Text 	The job title of the person (for example, Financial Manager).
knows 	Person 	The most generic bi-directional social/work relation.
knowsAbout 	Text  or Thing  or URL 	Of a Person, and less typically of an Organization, to indicate a topic that is known about - suggesting possible expertise but not implying it. We do not distinguish skill levels here, or relate this to educational content, events, objectives or JobPosting descriptions.
knowsLanguage 	Language  or Text 	Of a Person, and less typically of an Organization, to indicate a known language. We do not distinguish skill levels or reading/writing/speaking/signing here. Use language codes from the IETF BCP 47 standard.
makesOffer 	Offer 	A pointer to products or services offered by the organization or person. Inverse property: offeredBy
memberOf 	Organization  or ProgramMembership 	An Organization (or ProgramMembership) to which this Person or Organization belongs. Inverse property: member
naics 	Text 	The North American Industry Classification System (NAICS) code for a particular organization or business person.
nationality 	Country 	Nationality of the person.
netWorth 	MonetaryAmount  or PriceSpecification 	The total financial value of the person as calculated by subtracting assets from liabilities.
owns 	OwnershipInfo  or Product 	Products owned by the organization or person.
parent 	Person 	A parent of this person. Supersedes parents.
performerIn 	Event 	Event that this person is a performer or participant in.
publishingPrinciples 	CreativeWork  or URL 	The publishingPrinciples property indicates (typically via URL) a document describing the editorial principles of an Organization (or individual e.g. a Person writing a blog) that relate to their activities as a publisher, e.g. ethics or diversity policies. When applied to a CreativeWork (e.g. NewsArticle) the principles are those of the party primarily responsible for the creation of the CreativeWork. While such policies are most typically expressed in natural language, sometimes related information (e.g. indicating a funder) can be expressed using schema.org terminology.
relatedTo 	Person 	The most generic familial relation.
seeks 	Demand 	A pointer to products or services sought by the organization or person (demand).
sibling 	Person 	A sibling of the person. Supersedes siblings.
sponsor 	Organization  or Person 	A person or organization that supports a thing through a pledge, promise, or financial contribution. e.g. a sponsor of a Medical Study or a corporate sponsor of an event.
spouse 	Person 	The person's spouse.
taxID 	Text 	The Tax / Fiscal ID of the organization or person, e.g. the TIN in the US or the CIF/NIF in Spain.
telephone 	Text 	The telephone number.
vatID 	Text 	The Value-added Tax ID of the organization or person.
weight 	QuantitativeValue 	The weight of the product or person.
workLocation 	ContactPoint  or Place 	A contact location for a person's place of work.
worksFor 	Organization 	Organizations that the pe son works for.


https://schema.org/PostalAddress
Properties from PostalAddress
addressCountry 	Country  or Text 	The country. For example, USA. You can also provide the two-letter ISO 3166-1 alpha-2 country code.
addressLocality 	Text 	The locality in which the street address is, and which is in the region. For example, Mountain View.
addressRegion 	Text 	The region in which the locality is, and which is in the country. For example, California or another appropriate first-level Administrative division
postOfficeBoxNumber 	Text 	The post office box number for PO box addresses.
postalCode 	Text 	The postal code. For example, 94043.
streetAddress 	Text 	The street address. For example, 1600 Amphitheatre Pkwy.



https://schema.org/ContactPoint
Properties from ContactPoint ~ extends a Thing
areaServed 	AdministrativeArea  or GeoShape  or Place  or Text 	The geographic area where a service or offered item is provided. Supersedes serviceArea.
availableLanguage 	Language  or Text 	A language someone may use with or at the item, service or place. Please use one of the language codes from the IETF BCP 47 standard. See also inLanguage
contactOption 	ContactPointOption 	An option available on this contact point (e.g. a toll-free number or support for hearing-impaired callers).
contactType 	Text 	A person or organization can have different contact points, for different purposes. For example, a sales contact point, a PR contact point and so on. This property is used to specify the kind of contact point.
email 	Text 	Email address.
faxNumber 	Text 	The fax number.
hoursAvailable 	OpeningHoursSpecification 	The hours during which this service or contact is available.
productSupported 	Product  or Text 	The product or service this support contact point is related to (such as product support for a particular product line). This can be a specific product or product line (e.g. "iPhone") or a general category of products or services (e.g. "smartphones").
telephone Properties from EmailMessage
recipient 	Audience  or ContactPoint  or Organization  or Person 	A sub property of participant. The participant who is at the receiving end of the action.
bccRecipient 	ContactPoint  or Organization  or Person 	A sub property of recipient. The recipient blind copied on a message.
ccRecipient 	ContactPoint  or Organization  or Person 	A sub property of recipient. The recipient copied on a message.
dateRead 	Date  or DateTime 	The date/time at which the message has been read by the recipient if a single recipient exists.
dateReceived 	DateTime 	The date/time the message was received if a single recipient exists.
dateSent 	DateTime 	The date/time at which the message was sent.
messageAttachment 	CreativeWork 	A CreativeWork attached to the message.
sender 	Audience  or Organization  or Person 	A sub property of participant. The participant who is at the sending end of the action.
toRecipient 	Audience  or ContactPoint  or Organization  or Person 	A sub property of recipient. The recipient who was directly sent the message.





https://schema.org/Audience
Properties from Audience ~ Thing
audienceType 	Text 	The target group associated with a given audience (e.g. veterans, car owners, musicians, etc.).
geographicArea 	AdministrativeArea 	The geographic area associated with the audience.

*/
