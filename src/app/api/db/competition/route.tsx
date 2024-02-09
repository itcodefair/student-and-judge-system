import { NextRequest, NextResponse } from "next/server";
import getDbCollection from "@/lib/getDbCollection";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const collection = await getDbCollection("competitions");
    if (!collection) {
      return null;
    }
    const res = await collection.find().toArray();

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const collection = await getDbCollection("competitions");
    if (!collection) {
      return null;
    }
    const res = await collection.insertMany(data);

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    // Handle errors
    return NextResponse.json(error, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { ids, status } = await req.json();

    const mongoIds = ids.map((id) => new ObjectId(id));

    const collection = await getDbCollection("competitions");
    if (!collection) {
      return null;
    }

    const res = await collection.updateMany(
      { _id: { $in: mongoIds } },
      { $set: { status: status } }
    );

    // Check if any documents were updated
    if (res.modifiedCount === 0) {
      console.log("in");
      return NextResponse.error();
    }
    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
