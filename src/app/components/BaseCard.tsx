import { Card } from '@mui/material'

interface Props {
  children: JSX.Element
  boxShadow?: boolean
}

export const BaseCard = ({ children, boxShadow }: Props) => {
  return (
    <li
      style={{
        listStyle: 'none',
        width: 300
      }}
    >
      <Card
        sx={{
          height: 350,
          maxHeight: 350,
          overflowY: 'auto',
          padding: 2,
          margin: 2,
          borderRadius: 2,
          boxShadow: boxShadow === false ? 0 : 2
        }}
      >
        {children}
      </Card>
    </li>
  )
}
