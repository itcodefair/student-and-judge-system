import { NextRequest, NextResponse } from "next/server";
import getDbCollection from "@/lib/getDbCollection";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  try {
    const collection = await getDbCollection("competitions");
    if (!collection) {
      return null;
    }
    if (id) {
      const competition = await collection.findOne({ _id: new ObjectId(id) });
      if (!competition) {
        return NextResponse.json(
          { error: "Competition not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(competition, { status: 200 });
    }
    const competitions = await collection
      .find({ status: { $ne: "archived" } })
      .sort({ createdDate: -1 })
      .toArray();

    return NextResponse.json(competitions, { status: 200 });
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
      return NextResponse.error();
    }
    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
