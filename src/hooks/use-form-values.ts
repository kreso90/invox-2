import { type ChangeEvent, useState } from "react";

type StringFields = Record<string, string>;

export function useFormValues<T extends StringFields>(initialValues: T) {
	const [formValues, setFormValues] = useState<T>(initialValues);

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;

		setFormValues((current) => {
			if (!(name in current)) {
				return current;
			}

			return { ...current, [name]: value } as T;
		});
	}

	return { formValues, setFormValues, handleInputChange };
}
