import { NextRequest, NextResponse } from "next/server";
import getDbCollection from "@/lib/getDbCollection";
import { ObjectId } from "mongodb";
import moment from "moment";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  try {
    const collection = await getDbCollection("rubrics");
    if (!collection) {
      return null;
    }
    if (id) {
      const res = await collection.findOne({ _id: new ObjectId(id) });
      if (!res) {
        return NextResponse.json(
          { error: "Competition not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(res, { status: 200 });
    } else {
      const res = await collection
        .find({ status: { $not: { $regex: "archived", $options: "i" } } })
        .sort({ createdDate: -1 })
        .toArray();
      return NextResponse.json(res, { status: 200 });
    }
  } catch (error) {
    throw NextResponse.json(error, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const collection = await getDbCollection("rubrics");
    if (!collection) {
      return null;
    }
    const res = await collection.insertMany(data);

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    throw NextResponse.json(error, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { ids, ...values } = await req.json();

    let mongoIds;
    if (Array.isArray(ids)) {
      mongoIds = ids.map((id) => new ObjectId(id));
    } else {
      mongoIds = [new ObjectId(ids)];
    }

    const collection = await getDbCollection("rubrics");
    if (!collection) {
      return null;
    }

    const res = await collection.updateMany(
      { _id: { $in: mongoIds } },
      { $set: { updatedDate: moment().format(), ...values } }
    );

    // Check if any documents were updated
    if (res.modifiedCount === 0) {
      return NextResponse.error();
    }
    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    throw NextResponse.json(error, { status: 500 });
  }
}
