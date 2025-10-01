// export default async function saveToDB({prompt,response,email}) {

//     try {
//         const res = await fetch("/api/savetodb/", {
//             method: "POST",
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             credentials: "include",
//             body: JSON.stringify({prompt,response,email})
//         })

//         const data = await res.json()
//         return data
//     }
//     catch(error) {
//         return JSON.stringify({"reply":error})
//     }
// }