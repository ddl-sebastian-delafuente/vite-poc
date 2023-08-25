import * as React from 'react';
import CreateUserModal from './CreateUserModal';
import {	
	DominoCommonUserCreateUserRequest as CreateUserRequest,
	DominoCommonUserUserCreationContext as UserCreationContext,
} from '@domino/api/dist/types';
import { createUser, getUserCreationContext } from '@domino/api/dist/Users';
import * as toastr from '@domino/ui/dist/components/toastr'

const CreateUserView: React.FC = () => {
	const [userCreationContext, setUserCreationContext] = React.useState<UserCreationContext>()

	const onSubmit = async (body: CreateUserRequest) => {
		try {
			await createUser({body})
			window.location.reload();
			toastr.success(`User created`)
		} catch (e) {
			const error = await e.body.json()
			toastr.error(error.message ? error.message : `Could not create user`)
		}
	}

	const fetchUserCreationContext = React.useCallback(async () => {
		try {
			const result = await getUserCreationContext({})
			setUserCreationContext(result);
		} catch (e) {
			console.warn(e);
		}
	}, [setUserCreationContext]);

	React.useEffect(() => {
		fetchUserCreationContext()
	}, [])

	return <>
		<CreateUserModal
			userCreationContext={userCreationContext}
			onSubmit={onSubmit}
		/>
	</>
}

export default CreateUserView;
