import { useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, []);

  return null; // or a loading spinner
}
