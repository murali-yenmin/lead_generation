/**
 *
 * @param input as string
 * @returns Title Case formatted string
 * @example
 *
 *  input = "hello world" => return "Hello World"
 */
export const convertTitleCase = (input: string) => {
  return input
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
