import dotenv from "dotenv";
dotenv.config();

export default async function Handlegooglesearch(req,res) {
    const apiKey = process.env.LANGSEARCH_API;
    try {
        const response = await fetch('https://api.langsearch.com/v1/web-search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: req.body.question }),
        });

        const data = await response.json();

        if (!data?.data?.webPages?.value) {
            res.send({"reply":"Error occured in searching for your query"});
        }

        const realdata = data.data.webPages.value.map((value) => value.snippet);
        res.send({"reply":realdata});

    } catch (error) {
        res.send({"reply":"Error occured in searching for your query"});
    }
}