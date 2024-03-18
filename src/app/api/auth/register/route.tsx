import { NextRequest, NextResponse } from "next/server";
import getDbCollection from "@/lib/getDbCollection";
import { ObjectId } from "mongodb";
import moment from "moment";
import { RegisterFormData } from "@/app/auth/component/RegisterForm";
import { isEmpty, isEmail, equals } from "validator";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  const data: RegisterFormData = await req.json();
  const {
    firstName,
    lastName,
    gender,
    email,
    password,
    confirmPassword,
    educationLevel,
    school,
    credit,
  } = data;
  try {
    if (
      isEmpty(firstName) ||
      isEmpty(lastName) ||
      isEmpty(gender) ||
      isEmpty(password) ||
      isEmpty(confirmPassword) ||
      isEmpty(educationLevel) ||
      isEmpty(school) ||
      !isEmail(email)
    ) {
      return NextResponse.json("Invalid inputs", { status: 400 });
    }

    if (!equals(password, confirmPassword)) {
      return NextResponse.json("Confirm password did not match", {
        status: 400,
      });
    }

    const collection = await getDbCollection("users");
    if (!collection) {
      return NextResponse.json("Database not found", {
        status: 504,
      });
    }

    const existingUser = await collection.findOne({ email: email });

    if (existingUser) {
      return NextResponse.json(`User email already exist in the system`, {
        status: 406,
      });
    }

    const hashedPassword = await hash(password, 12);

    const newUser = {
      name: `${firstName} ${lastName}`,
      gender,
      email,
      password: hashedPassword,
      educationLevel,
      school,
      credit,
      isVerified: false,
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    const result = await collection.insertOne(newUser);
    if (result.acknowledged) {
      // const _id = (await result).insertedId.toString();
      return NextResponse.json("Success", { status: 200 });
    }
    return NextResponse.json("Failed to register user", { status: 500 });
  } catch (error) {
    return NextResponse.json("Internal server error", {
      status: 500,
    });
  }
}
