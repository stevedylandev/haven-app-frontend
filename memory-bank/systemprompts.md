# System Prompts Documentation

This document provides an in-depth overview of system prompts used in our project to guide interactions between the assistant, user, and various tools. System prompts play a crucial role in ensuring consistency, clarity, and effectiveness in how the AI responds to user queries and utilizes internal tools.

---

## 1. Overview

System prompts are a set of pre-defined instructions that shape the behavior of the AI assistant. They:

- Define the context and role of the assistant.
- Guide the assistant on how to process and respond to user requests.
- Ensure compliance with task-specific requirements.
- Dictate the use of helper tools in structured interactions.

---

## 2. Objectives of System Prompts

- **Guidance:** Provide clear instructions on context boundaries and responsibilities.
- **Accuracy:** Ensure that the assistant adheres to guidelines when generating responses.
- **Efficiency:** Help streamline processing steps for various tasks and tool usage.
- **Compliance:** Maintain consistency with the project’s overall architecture and documentation requirements.

---

## 3. Components of a System Prompt

### 3.1 Context and Role Definition

- **Role Assignment:** The system prompts define that the assistant acts as an architect or developer, ensuring alignment with project goals.
- **Context Inclusion:** Include project-specific details such as directories, file structures, and current working context to inform response generation.

### 3.2 Instruction Structure

- **XML-Style Formatting:** All tool uses are structured in XML-style tags to facilitate parsing and execution.
- **Step-by-Step Guidance:** Detailed instructions break down the tasks into clear steps, helping the assistant decide the appropriate response and tool usage.

### 3.3 Feedback Handling

- When the user provides feedback (e.g., "create a detailed systemprompts doc"), the assistant:
  - Analyzes the feedback in the context of existing guidelines.
  - Updates or creates documentation that aligns with the user’s input.
  - Ensures that responses maintain clarity and adhere to predefined structures.

---

## 4. Guidelines for Crafting Effective System Prompts

### 4.1 Clarity and Conciseness

- Prompts should be unambiguous and free of vague language.
- Use precise language to define expected outcomes.

### 4.2 Comprehensive Detailing

- Provide background context, objectives, and specific instructions.
- Include notes on security, scalability, and potential future modifications.

### 4.3 Structured Formatting

- Use clear headings and bullet points for easy navigation.
- Follow a consistent layout across all documentation:
  - **Introduction/Overview**
  - **Objectives/Goals**
  - **Detailed Instructions**
  - **Examples and Use Cases**
  - **Conclusion**

### 4.4 Integration with Other Documentation

- Ensure consistency with other project's documents such as:
  - Frontend Guidelines (FRONTEND_GUIDELINES.md)
  - Backend Structure (backend_structure.md)
  - Tech Stack Overview (TECH_STACK.md)
- Cross-reference documents where relevant to maintain coherence.

---

## 5. Best Practices for Responding to User Queries

- **Assessment:** Always assess the current project environment and the last provided instructions.
- **Tool Utilization:** Ensure that any interactions involving tools adhere to the XML-style formatting.
- **Feedback Incorporation:** Promptly incorporate user feedback into subsequent documents and updates.
- **Layered Response:** Provide a confident initial response and then wait for further user feedback or tool execution results.

---

## 6. Example Use Case

### Scenario:

A user asks, "Create a detailed systemprompts doc."

### Steps:

1. **Understand the Request:** Recognize that the user requires comprehensive documentation on system prompts.
2. **Prepare Documentation:** Draft a document that explains:
   - What system prompts are.
   - Their purpose.
   - Their structure and components.
   - Best practices for writing system prompts.
3. **Tool Utilization:** Use the `<write_to_file>` tool to save the document and `<attempt_completion>` tool to communicate success.
4. **Feedback Iteration:** Include user feedback in any subsequent revisions.

---

## 7. Conclusion

The system prompts guide the assistant in providing precise, actionable, and context-aware responses. By adhering to these documented guidelines, the project ensures efficient and effective AI interactions that align with project goals and maintain high-quality output.

This document will be updated periodically to incorporate new insights and evolving guidelines in system prompt formulation.
