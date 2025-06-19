'use client';

import React, { useState } from 'react';

const faqs = [
    {
        question: "What is the main benefit of using Optimiste AI platform for compliance?",
        answer: "Our platform automates complex disclosure and compliance workflows, reducing manual effort and minimizing errors for ESG, RFP, IT Security, Audit, and other regulatory needs.",
    },
    {
        question: "How does the platform ensure the accuracy of disclosures?",
        answer: "Optimiste AI leverages advanced validation, data cross-checks, and compliance rules to ensure your disclosures are accurate and up-to-date.",
    },
    {
        question: "Can the platform handle multiple compliance frameworks?",
        answer: "Yes, it supports a wide range of frameworks including ESG, IT Security, Audit, and more, and can be customized for your industry.",
    },
    {
        question: "Is my data secure on this platform?",
        answer: "Absolutely. We use industry-standard encryption, secure AWS storage, and strict access controls to protect your sensitive data.",
    },
    {
        question: "How does Optimiste AI automate RFP responses?",
        answer: "Optimiste AI automatically extracts relevant information from your data sources and generates accurate, compliant RFP responses in minutes.",
    },
    {
        question: "Can I integrate the platform with my existing tools?",
        answer: "Yes, we offer integrations with Microsoft Office, Google Drive, Dropbox, SharePoint, and more for seamless workflow.",
    },
    {
        question: "How does the platform support ESG reporting?",
        answer: "Our solution automates ESG data collection, validation, and report generation to meet regulatory and stakeholder requirements efficiently.",
    },
    {
        question: "Can multiple team members collaborate on disclosures?",
        answer: "Yes, our platform supports team collaboration with role-based permissions and real-time editing.",
    },
    {
        question: "What support options are available?",
        answer: "We provide 24/7 support, onboarding assistance, and a dedicated customer success manager for enterprise clients.",
    },
    {
        question: "How quickly can I get started?",
        answer: "Most organizations are up and running within a day, with guided onboarding and integration support from our team.",
    },
];

export default function HelpPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <main className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Help & FAQs</h1>
            <div className="divide-y divide-gray-200">
                {faqs.map((faq, idx) => (
                    <div key={faq.question} className="py-6">
                        <button
                            className="flex justify-between items-center w-full text-left text-xl font-semibold text-blue-900 focus:outline-none"
                            onClick={() => toggle(idx)}
                        >
                            <span>{faq.question}</span>
                            <span className="ml-4 text-3xl select-none">
                                {openIndex === idx ? '−' : '+'}
                            </span>
                        </button>
                        {openIndex === idx && (
                            <div className="mt-4 text-md text-gray-800 text-base animate-fade-in">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
