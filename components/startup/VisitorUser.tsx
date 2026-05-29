import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { fetchVisitor, loadVisitor } from "@/store/features/visitorSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

type Props = {
  setLoading: (val: boolean) => void;
};

export default function VisitorUser({ setLoading }: Props) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.visitor);

  useEffect(() => {
    const initVisitor = async () => {
      try {
        // Check AsyncStorage for existing visitor data
        const localVisitor = await AsyncStorage.getItem("visitor_data");

        if (localVisitor) {
          // Returning user — load from AsyncStorage, no API call needed
          const parsed = JSON.parse(localVisitor);
          dispatch(loadVisitor(parsed));
          console.log("📦 Visitor loaded from AsyncStorage:", parsed.visitorId);
        } else {
          // New user — call register API
          dispatch(fetchVisitor());
        }
      } catch (err) {
        console.error("❌ VisitorUser init error:", err);
        // Fallback: try API anyway
        dispatch(fetchVisitor());
      }
    };

    initVisitor();
  }, [dispatch]);

  // Stop loading when visitor is ready
  useEffect(() => {
    if (status === "success" || status === "error") {
      setLoading(false);
    }
  }, [status, setLoading]);

  return null; // renders nothing — logic only
}
