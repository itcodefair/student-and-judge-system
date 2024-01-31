import { NextRequest, NextResponse } from "next/server";
import getDbCollection from "@/lib/getDbCollection";

export async function GET() {
	try {
		const document = await getDbCollection("competitions");

		const compItems = await document.find().toArray();

		return NextResponse.json(compItems, { status: 200 });
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}
