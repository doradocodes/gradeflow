'use client';

import {Input, InputBase} from "@/components/base/input/input";
import {Button} from "@/components/base/buttons/button";
import Modal from "@/components/Modal";
import {useRef, useState} from "react";
import {Badge} from "@/components/base/badges/badges";
import {CheckCircle} from "@untitledui/icons";
import {createSubmission} from "@/utils/firestore";
import {ProgressBar} from "@/components/base/progress-indicators/progress-indicators";
import {InputGroup} from "@/components/base/input/input-group";

const URL_PATTERN = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

const isValidUrl = (url) => URL_PATTERN.test(url);

export default function StudentSubmissionForm({ assignment }) {
    const formRef = useRef(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedAt, setSubmittedAt] = useState(null);
    const [error, setError] = useState(null);
    const [deliverableProgress, setDeliverableProgress] = useState(0);
    const validDeliverables = useRef({});

    const updateDeliverableProgress = (name, isValid) => {
        validDeliverables.current[name] = isValid;
        const count = Object.values(validDeliverables.current).filter(Boolean).length;
        setDeliverableProgress(count);
    };

    const onCreateSubmission = async (values) => {
        try {
            const data = {
                ...values,
                assignmentId: assignment.id,
                status: values.submittedAt.getTime() < new Date(assignment.dueDate).getTime() ? 'on_time' : 'late',
            };

            await createSubmission(data);
        } catch (err) {
            console.error('Error creating submission:', err);
            setError('An error occurred while submitting. Please try again.');
        }
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const data = {
            studentName: formRef.current.elements.studentName.value,
            studentEmail: formRef.current.elements.studentEmail.value,
            deliverables: assignment?.deliverables?.map((d) => ({
                name: d.name,
                value: e.target.elements[`deliverables-${d.name}`].value,
                required: d.required,
                type: d.type,
            })),
            submittedAt: currentDate,
        };

        await onCreateSubmission(data);
        setIsSubmitted(true);
        setSubmittedAt(data.submittedAt);
    };

    return <div className="border border-gray-300 p-8 rounded-lg shadow-lg w-full">
        <form ref={formRef} onSubmit={onSubmitForm} className="">
            <div>
                <div className="flex flex-col gap-2 pb-8 border-b border-gray-300">
                    <h2 className="font-bold text-secondary mb-4">Student Information</h2>
                    <SubmissionInput
                        type={"text"}
                        name={"studentName"}
                        label={"Student Name"}
                        placeholder={"Enter your full name"}
                        required
                    />
                    <SubmissionInput
                        type={"email"}
                        name={"studentEmail"}
                        label={"Student Email"}
                        placeholder={"Enter your email"}
                        required
                        validate={(value) => {
                            if (!value.trim()) {
                                return 'Student email is required.';
                            }
                            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailPattern.test(value.trim())) {
                                return 'Please enter a valid email address.';
                            }
                            return null;
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2 mb-4 pt-8">
                    <h2 className="font-bold text-secondary mb-4">Deliverables</h2>
                    {assignment?.deliverables?.map((d) => (
                        <div key={d.name} className="flex flex-col gap-1.5">
                            <DeliverableInput
                                name={d.name}
                                type={d.type}
                                required={d.required}
                                validate={(value) => {
                                    if (value.length < 1) return true;
                                    const trimmedValue = value.trim();
                                    if (trimmedValue && !isValidUrl(trimmedValue)) {
                                        return 'Please enter a valid URL';
                                    }
                                }}
                                onValidChange={(isValid) => updateDeliverableProgress(d.name, isValid)}
                            />
                        </div>
                    ))}
                    <div>
                        <ProgressBar value={deliverableProgress} min={0} max={assignment?.deliverables?.length || 0} labelPosition="right" />
                    </div>
                </div>
            </div>
            <Button size="lg" className="w-full" type={"submit"}>Submit</Button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
        <Modal
            open={isSubmitted}
            onClose={() => setIsSubmitted(false)}
        >
            <div className="w-full h-full min-h-60 flex flex-col justify-center items-center pb-4">
                <h1 className="text-center font-bold text-3xl mb-4">Thank you for your submission!</h1>
                <p className="text-center">Your files were submitted at <b>{submittedAt?.toLocaleString()}</b>.</p>
                <p className="text-center">You can now close this page.</p>
            </div>
        </Modal>
    </div>
}

function SubmissionInput({ name, type, label, placeholder, required, validate, defaultValue }) {
    const [value, setValue] = useState(defaultValue || '');
    const [error, setError] = useState(null);

    return <div>
        <Input
            type={type}
            name={name}
            label={label}
            placeholder={placeholder}
            isRequired={required}
            isInvalid={!!error}
            hint={error || undefined}
            onBlur={(e) => {
                setValue(e.target.value);
                if (required && !e.target.value.trim()) {
                    setError(`${label} is required.`);
                } else if (validate) {
                    setError(validate(e.target.value));
                } else {
                    setError(null);
                }
            }}
        />
    </div>
}

function DeliverableInput({ name, type, label, required, validate, defaultValue, onValidChange }) {
    const [value, setValue] = useState(defaultValue || '');
    const [error, setError] = useState(null);

    if (type === 'url') {
        return (
            <div className="flex gap-2">
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-secondary font-medium">{name}</span>
                        <Badge color="brand" size="sm">{type}</Badge>
                        {required && <Badge color="error" size="sm">Required</Badge>}
                    </div>
                    <Input
                        type="text"
                        name={`deliverables-${name}`}
                        placeholder={`Enter URL`}
                        isRequired={required}
                        isInvalid={!!error}
                        hint={error || undefined}
                        data-filetype="url"
                        defaultValue={defaultValue || ''}
                        onBlur={(e) => {
                            const val = e.target.value;
                            setValue(val);
                            let err = null;
                            if (required && !val.trim()) {
                                err = `${name} is required.`;
                            } else if (validate) {
                                err = validate(val) || null;
                            }
                            setError(err);
                            if (required) {
                                onValidChange?.(!err && val.trim().length > 0);
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
}