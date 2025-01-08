import FileModel from "@/models/knowledgeBase/File.model";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    
    const file=await FileModel.findByIdAndDelete(id)

    return NextResponse.json(
      { message:"File Deleted"},
      { status: 200 }
    );
  } catch (error) {
     return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
