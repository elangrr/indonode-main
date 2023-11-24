import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import CopyButton from '@/components/CopyButton'
import { Box } from '@chakra-ui/react'

const CodeSnippet = ({ code }: { code: string }) => {
  return (
    <Box
      bgColor={'gray.50'}
      position={'relative'}
      fontFamily={'JetBrains Mono'}
      borderWidth={'thin'}
      borderColor={'gray.300'}
      borderRadius={'md'}
      p={1}
      overflowX={'auto'}
    >
      <CopyButton code={code} theme={'light'} />
      <SyntaxHighlighter
        customStyle={{ background: 'none' }}
        language="bash"
        style={atomOneLight}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  )
}

export default CodeSnippet
