"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Group, Stack, Textarea, Title } from "@mantine/core";
import { useForm } from "react-hook-form";
import { type EntryFormValues, entrySchema, useCreateEntry } from "@/features";

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Title order={3}>Новая запись</Title>

        {error && <Alert color="red">{error}</Alert>}

        <Textarea
          label="Ситуация"
          placeholder="Что произошло? Опишите ситуацию..."
          minRows={3}
          autosize
          {...register("situation")}
          error={errors.situation?.message}
        />

        <Textarea
          label="Достижение"
          placeholder="Что вы сделали хорошо? Ваш успех..."
          minRows={3}
          autosize
          {...register("achievement")}
          error={errors.achievement?.message}
        />

        <Textarea
          label="Эмоция"
          placeholder="Что вы чувствовали?"
          minRows={2}
          autosize
          {...register("emotion")}
          error={errors.emotion?.message}
        />

        <Textarea
          label="Мысль"
          placeholder="О чём вы думали в этот момент?"
          minRows={3}
          autosize
          {...register("thought")}
          error={errors.thought?.message}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={createEntryMutation.isPending}>
            Сохранить
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
