"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/client/api";
import { queryClient } from "../lib/client/query-client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Orbit } from "lucide-react";

export default function Products() {
  const [isActive, setIsActive] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return (await api.products.get()).data;
    },
  });

  const refetchProducts = () => {
    // queryClient.invalidateQueries({
    //   queryKey: ["products"],
    // });
    queryClient.refetchQueries({
      queryKey: ["products"],
    });
  };

  useEffect(() => {
    console.log(isOpen);
  }, [isOpen]);

  return (
    <div className="bg-foreground h-screen flex md:flex-col flex-col md:text-white text-green-400 md:text-4xl text-xl md:gap-10 gap-4">
      <p>Products</p>
      <p>catalog</p>
      <div className="text-xl text-red-500">
        {isProductsLoading
          ? "Loading..."
          : products?.map((products) => (
              <p key={products.id}>{products.name}</p>
            ))}
        <Button
          onClick={refetchProducts}
          className="text-blue-500 bg-green-300 p-2 cursor-pointer"
        >
          Refetch products
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            "h-10 w-40 rounded-xl",
            isActive ? "bg-green-600" : "bg-red-500",
          )}
        />
        <Button
          onClick={() => setIsActive(!isActive)}
          variant={"secondary"}
          className="w-fit"
        >
          Че то делает
        </Button>
      </div>
      <div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <Button variant={"secondary"}>Open sheet</Button>
          </SheetTrigger>
          <SheetContent className="p-4 flex flex-col">
            <Orbit className="text-black size-40 p-2" />
            <p>
              An orbit is the curved, repeating path that an object in space
              (such as a planet, moon, asteroid, or spacecraft) takes around
              another object due to the influence of gravity. These paths are
              generally elliptical (oval-shaped) rather than perfectly circular.
              Objects in orbit are called satellites, which can be natural (like
              the Moon) or artificial (like the ISS).
            </p>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
