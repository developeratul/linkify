import * as Chakra from "@chakra-ui/react";
import Link from "next/link";

export default function Hero() {
  return (
    <Chakra.Box py={{ base: "24", lg: "52" }}>
      <Chakra.Container maxW="container.xl">
        <Chakra.VStack textAlign="center" spacing="30">
          <Chakra.Heading
            color="gray.600"
            as="h1"
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl", xl: "60" }}
            fontFamily="monospace"
            fontWeight="bold"
          >
            The single link that handles all of your links
          </Chakra.Heading>
          <Chakra.Text
            maxW="container.md"
            fontSize={{ base: "16", sm: "18", xl: "20" }}
            color="gray.600"
          >
            LinkVault enables you to showcase your links in one single profile
            while being able to collect testimonials and run your newsletter
            (Coming soon...)
          </Chakra.Text>
          <Chakra.Button
            as={Link}
            href="/app"
            fontWeight="light"
            size={{ base: "md", xl: "lg" }}
            colorScheme="purple"
          >
            Claim your username
          </Chakra.Button>
          <Chakra.HStack
            spacing="24px"
            flexWrap="wrap"
            justify="center"
            display={{ base: "none", lg: "flex" }}
          >
            <svg
              width="83"
              height="83"
              viewBox="0 0 83 83"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.2083 34.5833V48.4167H34.5833V72.625H48.4166V48.4167H58.7916L62.25 34.5833H48.4166V27.6667C48.4166 26.7495 48.781 25.8698 49.4296 25.2213C50.0781 24.5727 50.9578 24.2083 51.875 24.2083H62.25V10.375H51.875C47.2889 10.375 42.8907 12.1968 39.6479 15.4396C36.4051 18.6824 34.5833 23.0806 34.5833 27.6667V34.5833H24.2083Z"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="83"
              height="83"
              viewBox="0 0 83 83"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M76.0833 13.868C72.625 15.5625 69.2358 16.2508 65.7083 17.2917C61.8315 12.9169 56.0838 12.6748 50.5608 14.7429C45.0379 16.811 41.4204 21.8671 41.5 27.6667V31.125C30.2777 31.4121 20.2831 26.3007 13.8333 17.2917C13.8333 17.2917 -0.629427 42.9975 27.6667 55.3334C21.1927 59.6459 14.7359 62.5544 6.91666 62.25C18.3568 68.4854 30.8241 70.6296 41.6176 67.4963C53.9984 63.8997 64.1728 54.621 68.0773 40.7219C69.242 36.4947 69.8204 32.1275 69.7961 27.7428C69.7892 26.8817 75.0182 18.1563 76.0833 13.8645V13.868Z"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="83"
              height="83"
              viewBox="0 0 83 83"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M31.125 65.7084C16.2542 70.55 16.2542 57.0625 10.375 55.3334M51.875 72.625V60.5209C51.875 57.0625 52.2208 55.6792 50.1458 53.6042C59.8292 52.5667 69.1667 48.7625 69.1667 32.8542C69.1625 28.7214 67.5501 24.7524 64.6708 21.7875C66.0212 18.1977 65.8969 14.2194 64.325 10.7209C64.325 10.7209 60.5208 9.68338 52.2208 15.2167C45.1909 13.3858 37.8091 13.3858 30.7792 15.2167C22.4792 9.68338 18.675 10.7209 18.675 10.7209C17.1031 14.2194 16.9788 18.1977 18.3292 21.7875C15.4499 24.7524 13.8375 28.7214 13.8333 32.8542C13.8333 48.7625 23.1708 52.5667 32.8542 53.6042C30.7792 55.6792 30.7792 57.7542 31.125 60.5209V72.625"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="83"
              height="83"
              viewBox="0 0 83 83"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M62.25 13.8333H20.75C16.93 13.8333 13.8333 16.93 13.8333 20.75V62.25C13.8333 66.07 16.93 69.1667 20.75 69.1667H62.25C66.07 69.1667 69.1667 66.07 69.1667 62.25V20.75C69.1667 16.93 66.07 13.8333 62.25 13.8333Z"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M27.6667 38.0417V55.3333"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M27.6667 27.6667V27.7013"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M41.5 55.3333V38.0417"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M55.3333 55.3333V44.9583C55.3333 43.1239 54.6046 41.3646 53.3075 40.0675C52.0104 38.7704 50.2511 38.0417 48.4167 38.0417C46.5823 38.0417 44.823 38.7704 43.5258 40.0675C42.2287 41.3646 41.5 43.1239 41.5 44.9583"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="83"
              height="83"
              viewBox="0 0 83 83"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M55.3333 13.8333H27.6667C20.0267 13.8333 13.8333 20.0267 13.8333 27.6667V55.3333C13.8333 62.9733 20.0267 69.1667 27.6667 69.1667H55.3333C62.9733 69.1667 69.1667 62.9733 69.1667 55.3333V27.6667C69.1667 20.0267 62.9733 13.8333 55.3333 13.8333Z"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M41.5 51.875C47.23 51.875 51.875 47.23 51.875 41.5C51.875 35.77 47.23 31.125 41.5 31.125C35.77 31.125 31.125 35.77 31.125 41.5C31.125 47.23 35.77 51.875 41.5 51.875Z"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M57.0625 25.9375V25.9418"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="83"
              height="83"
              viewBox="0 0 83 83"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M58.7917 17.2917H24.2083C16.5684 17.2917 10.375 23.4851 10.375 31.125V51.875C10.375 59.5149 16.5684 65.7083 24.2083 65.7083H58.7917C66.4316 65.7083 72.625 59.5149 72.625 51.875V31.125C72.625 23.4851 66.4316 17.2917 58.7917 17.2917Z"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M34.5833 31.125L51.875 41.5L34.5833 51.875V31.125Z"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="83"
              height="83"
              viewBox="0 0 83 83"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.8334 17.2917V55.3333C13.8334 56.2505 14.1978 57.1302 14.8463 57.7787C15.4949 58.4273 16.3745 58.7917 17.2917 58.7917H24.2084V72.625L38.0417 58.7917H57.3531C58.273 58.7917 59.1514 58.4285 59.7981 57.7784L68.15 49.4299C68.7967 48.7798 69.1633 47.9014 69.1633 46.9814V17.2917C69.1633 16.3744 68.7989 15.4948 68.1504 14.8462C67.5018 14.1977 66.6222 13.8333 65.705 13.8333H17.2883C16.3711 13.8333 15.4914 14.1977 14.8429 14.8462C14.1943 15.4948 13.8334 16.3744 13.8334 17.2917Z"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M55.3333 27.6666V41.5"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M41.5 27.6666V41.5"
                stroke="#4A5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Chakra.HStack>
        </Chakra.VStack>
      </Chakra.Container>
    </Chakra.Box>
  );
}
