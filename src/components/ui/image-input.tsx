/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client";

import { api } from "@/app/lib/client/api";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Image } from "./image";

export function ImageInput({
  onSaved,
  value,
}: {
  onSaved: (id: string) => void;
  value?: string | null;
}) {
  const [savedFile, setSavedFile] = useState<string | null>(value ?? null);

  const ref = useRef<HTMLInputElement>(null);

  const saveFileMutation = useMutation({
    mutationKey: ["saveFile"],
    mutationFn: async (file: File) => {
      const res = await api.file.post({
        file: file,
      });

      if (res.error) {
        throw new Error(res.error.value.message);
      }

      return res.data;
    },
    onError: () => {
      toast.error("Ошибка сохранения фото");
    },
    onSuccess: (id) => {
      setSavedFile(id);
      onSaved(id);
    },
  });

  return (
    <div className="relative aspect-square h-40 w-40 rounded-2xl border border-zinc-700 border-dashed overflow-hidden">
      <input
        id="file-upload"
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => saveFileMutation.mutate(e.target.files![0])}
      />
      <label
        htmlFor="file-upload"
        className="w-full h-full absolute cursor-pointer block"
      />
      {savedFile && (
        <div className=" w-full h-full bg-red-500">
          <Image src={savedFile} />
        </div>
      )}
    </div>
  );
}
