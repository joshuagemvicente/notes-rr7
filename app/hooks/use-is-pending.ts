import { useFormAction, useNavigation } from "react-router";

interface isPendingProps {
  formAction?: string;
  formMethod?: "POST" | "GET" | "PUT" | "DELETE";
  state?: "submitting" | "loading" | "non-idle";
}

export function useIsPending({
  formAction,
  formMethod = "POST",
  state = "non-idle",
}: isPendingProps = {}) {
  const contextualFormAction = useFormAction();
  const navigation = useNavigation();
  const isPendingState =
    state === "non-idle"
      ? navigation.state !== "idle"
      : navigation.state === state;

  return (
    isPendingState &&
    navigation.formAction === (formAction ?? contextualFormAction) &&
    navigation.formMethod === formMethod
  );
}
