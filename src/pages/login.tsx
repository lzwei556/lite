import { Flex } from 'components';
import { LangSwitcher } from '../localeProvider';
import { Brand } from 'common/components/brand';
import { LoginForm, useLoginStyles } from 'features/auth';

export default function Login() {
  const { styles, brandName, languageSwitcherStyle } = useLoginStyles();

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <Brand height={80} gap={48} brandNameStyle={brandName} />
        <Flex className={styles.splitLineWrapper}>
          <div className={styles.splitLine} />
        </Flex>
      </div>
      <LoginForm className={styles.loginForm} />
      <div className={styles.langSwitcher}>
        <LangSwitcher style={languageSwitcherStyle} />
      </div>
    </div>
  );
}
