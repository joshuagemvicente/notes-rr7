interface ProfileComponentProps {
  name?: string;
  email?: string;
  image?: string;
}



export function ProfileComponent({ name, email, image }: ProfileComponentProps) {
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}
