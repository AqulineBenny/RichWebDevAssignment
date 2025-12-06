export async function GET() {
    console.log("in the orders stats api page");
    
    return Response.json({
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "sales": [1200, 1900, 1500, 2200, 1800, 2500]
    });
}
