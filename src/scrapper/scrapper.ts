import fetch from 'node-fetch';
import cheerio from 'cheerio';


async function getHtmlSource(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        return $.html();
    } catch (e: any) {
        return ''
    }
}

function extractLinks(html: string): string[] {
    const links: string[] = [];
    const $ = cheerio.load(html);
    $('a').each((index, element) => {
        const href = $(element).attr('href');
        if (href) {
            links.push(href);
        }
    });
    return links;
}

function extractUrl(input: string): string | null {
    const match = input.match(/\/url\?q=(.*?)&/);
    if (match) {
        return decodeURIComponent(match[1]);
    }
    return null;
}

function filterEmails(links: string[]): string[] {
    const excludedSubstrings = [
        '.png',
        '.sentry.io',
        '@sentry.',
        '.webp',
        '.jpg',
        '.jpeg'
    ];
    return links.filter(link => {
        return !excludedSubstrings.some(substring => {
            return link.includes(substring);
        });
    });
}


function filterLinks(links: string[]): string[] {
    const excludedSubstrings = [
        'wiktionary.org/',
        'bing.com/',
        'twitter.com/',
        'wikipedia.org/',
        'google.com/',
        'youtube.com/'
    ];
    return links.filter(link => {
        return !excludedSubstrings.some(substring => {
            return link.includes(substring);
        });
    });
}

function extractContactInfo(html: string, searchPhone: boolean = false): { phones: string[], emails: string[] } {
    const phonesRegex = /(\(?([\d \-\)\–\+\/\(]+){6,}\)?([ .\-–\/]?)([\d]+))/g;
    const emailsRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/g;
    const phones: string[] = [];
    const emails: string[] = [];

    if (searchPhone) {
        const phoneMatches = html.match(phonesRegex);
        if (phoneMatches) {
            phoneMatches.forEach(match => {
                phones.push(match.trim());
            });
        }
    }

    const emailMatches = html.match(emailsRegex);
    if (emailMatches) {
        emailMatches.forEach(match => {
            emails.push(match.trim());
        });
    }

    return { phones, emails: filterEmails(emails) };
}

const getLeadsByQueryAndPage = async (text: string, google: boolean, page = 0) => {
    let phones: string[] = [];
    let emails: string[] = [];

    const pageSize = 10
    const query = text.replace(' ', '+');

    const pageQueryStrGoogle = page ? '&start=' + (page * pageSize).toString() : '';
    const pageQueryStrBing = page ? '&first=' + (page * pageSize + 1).toString() : '';

    const googleURL = `https://www.google.com/search?q=${query}${pageQueryStrGoogle}`
    const bingURL = `https://www.bing.com/search?q=${query}${pageQueryStrBing}`

    const url = google ? googleURL : bingURL
    console.log("🚀 ~ file: scrapper.ts:106 ~ getLeadsByQueryAndPage ~ url:", url)
    const htmlSource = await getHtmlSource(url);

    const links = extractLinks(htmlSource)
    console.log("🚀 ~ file: scrapper.ts:29 ~ main ~ links:", links)

    const leads = filterLinks(links.map(extractUrl).filter(i => i) as string[])
    console.log("🚀 ~ file: scrapper.ts:44 ~ main ~ leads:", leads)

    const result: { [key: string]: string } = {}; //  { 'email@d.com': 'http://url.com' }

    for await (const leadUrl of leads) {
        const leadHTML = await getHtmlSource(leadUrl);
        const contactInfo = extractContactInfo(leadHTML);

        // Add URLs to the result object with email as the key
        if (contactInfo.emails.length > 0) {
            contactInfo.emails.forEach((email: string) => {
                result[email] = leadUrl;
            });
        }
    }

    return result;
}

function mergeJSONObjects(obj1: any, obj2: any): any {
    // Create a new object to hold the merged properties
    const mergedObj = {};

    // Merge properties from obj1 into the merged object
    for (const prop in obj1) {
        mergedObj[prop] = obj1[prop];
    }

    // Merge properties from obj2 into the merged object
    for (const prop in obj2) {
        mergedObj[prop] = obj2[prop];
    }

    return mergedObj;
}

export const scrapForContactsByString = async (text: string, google: boolean, wantedEmailCount = 50) => {
    text = text.replace(' ', '+')

    let i = 0;
    let dictionary = {}

    if (!text) return { empty: 'true' }

    while (Object.keys(dictionary).length < wantedEmailCount && i < 20) {
        const currentEmailsDic = await getLeadsByQueryAndPage(text, google, i)
        console.log("🚀 ~ file: scrapper.ts:161 ~ scrapForContactsByString ~ currentEmailsDic:", currentEmailsDic)
        dictionary = mergeJSONObjects(dictionary, currentEmailsDic)

        i++;
    }

    console.log("🚀 ~ file: scrapper.ts:110 ~ scrapForContactsByString ~ emails:", dictionary)
    return dictionary;
}
