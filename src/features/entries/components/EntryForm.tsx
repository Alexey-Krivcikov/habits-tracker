"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Divider, Group, Stack, Text, Textarea } from "@mantine/core";
import { IconBrain, IconDeviceFloppy, IconHeart, IconMessages, IconStar } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { type EntryFormValues, entrySchema, useCreateEntry } from "@/features";
import styles from "./EntryForm.module.scss";

const fields = [
  {
    name: "situation" as const,
    label: "Ситуация",
    placeholder: "Что произошло? Опишите обстоятельства...",
    icon: IconMessages,
    step: "1/4",
    hint: "Где и когда это случилось?",
  },
  {
    name: "achievement" as const,
    label: "Достижение",
    placeholder: "Что вы сделали хорошо? Ваш успех...",
    icon: IconStar,
    step: "2/4",
    hint: "Чем вы гордитесь в этой ситуации?",
  },
  {
    name: "emotion" as const,
    label: "Эмоция",
    placeholder: "Что вы чувствовали?",
    icon: IconHeart,
    step: "3/4",
    hint: "Радость, гордость, облегчение?",
  },
  {
    name: "thought" as const,
    label: "Мысль",
    placeholder: "О чём вы думали в этот момент?",
    icon: IconBrain,
    step: "4/4",
    hint: "Какие мысли пришли вам в голову?",
  },
] as const;

interface EntryFormProps {
  onSuccess?: () => void;
}

export function EntryForm({ onSuccess }: EntryFormProps) {
  const createEntryMutation = useCreateEntry();
  const error = createEntryMutation.error?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      situation: "",
      achievement: "",
      emotion: "",
      thought: "",
    },
  });

  const onSubmit = async (values: EntryFormValues) => {
    await createEntryMutation.mutateAsync(values);
    reset();
    onSuccess?.();
  };

  const renderField = (field: (typeof fields)[number]) => {
    const FieldIcon = field.icon;

    return (
      <div key={field.name}>
        <Group gap="xs" mb={4}>
          <FieldIcon size={18} />

          <Text className={styles.fieldHint}>{field.step}</Text>

          <Text size="sm" c="dimmed">
            {field.hint}
          </Text>
        </Group>

        <Textarea
          label={field.label}
          placeholder={field.placeholder}
          minRows={3}
          autosize
          {...register(field.name)}
          error={errors[field.name]?.message}
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        {error && <Alert color="red">{error}</Alert>}

        {renderField(fields[0])}
        {renderField(fields[1])}

        <Divider
          label={
            <Group gap="xs">
              <IconHeart size={14} />
              <Text size="sm" c="dimmed">
                Как вы это пережили
              </Text>
            </Group>
          }
          labelPosition="center"
        />

        {renderField(fields[2])}
        {renderField(fields[3])}

        <Group justify="flex-end" mt="sm">
          <Button
            type="submit"
            size="md"
            loading={createEntryMutation.isPending}
            leftSection={<IconDeviceFloppy size={18} />}
            className={styles.amberButton}
          >
            Сохранить запись
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
