import { Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { EntryForm } from "@/features/entries";
import styles from "./EntriesNewPage.module.scss";

export default function NewEntryPage() {
  return (
    <Container size="sm" className={styles.pageContainer}>
      <Stack className={styles.headerStack}>
        <Group className={styles.headerGroup}>
          <IconSparkles size={28} />
          <Title order={2} className={styles.headerTitle}>
            Новая запись
          </Title>
        </Group>

        <Text className={styles.headerDesc}>
          Запишите свой успех — ситуацию, достижение, эмоцию и мысль. Это поможет закрепить позитивный опыт.
        </Text>
      </Stack>

      <Paper className={styles.formCard}>
        <EntryForm />
      </Paper>
    </Container>
  );
}
