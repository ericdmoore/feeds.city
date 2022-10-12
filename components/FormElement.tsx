import { useFormInput } from '../compositeHooks/useFormInput.tsx'

interface FormProps {
    id: string, 
    name: string
    label: string
    placeholder: string,
}

export function FormElement(props:FormProps) {
    const inputText = useFormInput("")
    return (
        <div class="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
            <label for={props.name} class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">{props.label}</label>
            <input type="text" class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm" {...props} {...inputText}/>
        </div>
    )
}

export default FormElement