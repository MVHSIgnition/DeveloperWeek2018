<?php

class ESLPackageCreation

{
	//Define api key and api url
	private $url = "https://sandbox.esignlive.com/api";
	private $key = "bnhJMHR6R1J3cjAwOnZ6cWZrcEU1UTZNNg==";
	private $packageAppend = "/packages/";
	private $tokenAppend = "/signerAuthenticationTokens/";

	//Constructor method for ESLPackageCreation
	public function __construct()
	{

	}

	//Create package
	public function buildPackage($firstName, $lastName, $email)
	{
		$build = array(
			'type' => 'PACKAGE',
			'status' => 'DRAFT',
			'roles' => array(
				array(
					'id' => 'Signer1',
					'type' => 'SIGNER',
					'signers' => array(
						array(
							'email' => $email,
							'firstName' => $firstName,
							'lastName' => $lastName,
							'id' => 'Signer1',
						)
					) ,
				) ,
				array(
					'id' => 'Sender1',
					'type' => 'SENDER',
					'signers' => array(
						array(
							'email' => 'mvhsiot@gmail.com',
							'firstName' => 'EZGoal',
							'lastName' => 'MVHSIgnition',
							'id' => 'Sender1',
						)
					) ,
				) ,
			) ,
			'name' => 'PHP Application Example',
		);
		$packageJSON = json_encode($build);
		$packageId = json_decode($this->sendRequest($this->packageAppend, $packageJSON, NULL, NULL), true);
		return $packageId;
	}

	//Upload document
	public function buildDocument($packageId, $firstName, $lastName, $address, $city, $state, $zip, $country, $phoneNumber, $emailAddress, $company, $policyNumber)
	{
		$build = array(
			'fields' => array(
				array(
					'value' => $firstName,
					'name' => 'first_name',
				) ,
				array(
					'value' => $lastName,
					'name' => 'last_name',
				) ,
				array(
					'value' => $address,
					'name' => 'address',
				) ,
				array(
					'value' => $city,
					'name' => 'city',
				) ,
				array(
					'value' => $state,
					'name' => 'state',
				) ,
				array(
					'value' => $zip,
					'name' => 'zip',
				) ,
				array(
					'value' => $country,
					'name' => 'country',
				) ,
				array(
					'value' => $phoneNumber,
					'name' => 'phone_number',
				) ,
				array(
					'value' => $emailAddress,
					'name' => 'email',
				) ,
				array(
					'value' => $company,
					'name' => 'company',
				) ,
				array(
					'value' => $policyNumber,
					'name' => 'policy_number',
				) ,
			) ,
			'extract' => true,
			'name' => 'Sample Contract',
			'id' => 'contract'
		);
		$doc = file_get_contents("documents/sample_contract2.pdf");
		$documentJSON = json_encode($build);
		$status = $this->sendRequest($this->packageAppend . $packageId['id'] . '/documents', $documentJSON, $doc, NULL);
		return $status;
	}

	//Send Package
	public function buildSend($packageId)
	{
		$build = array(
			'status' => 'SENT'
		);
		$sendJSON = json_encode($build);
		$this->sendRequest($this->packageAppend . $packageId['id'], $sendJSON, NULL, 'application/json');
		return NULL;
	}

	//Sender signs consent and contract documents
	public function buildSign($packageId)
	{
		$build = array(
			'documents' => array(
				array(
					'id' => 'default-consent',
					'name' => 'Electronic Disclosures and Signatures Consent'
				) ,
				array(
					'id' => 'contract',
					'name' => 'Sample Contract'
				)
			)
		);
		$signJSON = json_encode($build);
		$signatureAppend = $this->packageAppend . $packageId['id'] . '/documents/signed_documents';
		$this->sendRequest($signatureAppend, $signJSON, NULL, 'application/json');
		return NULL;
	}

	//Get a session token
	public function buildToken($packageId)
	{
		$build = array(
			'packageId' => $packageId['id'],
			'signerId' => 'Signer1'
		);
		$tokenJSON = json_encode($build);
		$token = json_decode($this->sendRequest($this->tokenAppend, $tokenJSON, NULL, 'application/json'), true);
		return $token;
	}

	//cURL function to send requests to eSignLive
	private function sendRequest($type, $json, $document, $contentType)
	{
		if (is_null($document) && is_null($contentType))
		{
			$postfields = array(
				"payload" => $json
			);
		}
		else if (is_null($document) && !is_null($contentType))
		{
			$postfields = $json;
		}
		else
		{
			$postfields = array(
				"file" => $document,
				"payload" => $json
			);
		}

		$headerOptions = array(
			'Authorization: Basic ' . $this->key
		);
		if (!is_null($contentType))
		{
			$headerOptions[] = "Content-Type: $contentType";
		}

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->url . $type);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_FAILONERROR, true);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

		if (!is_null($postfields))
		{
			curl_setopt($ch, CURLOPT_POSTFIELDS, $postfields);
			if (!is_array($postfields))
			{
				$headerOptions[] = 'Content-Length: ' . strlen($postfields);
			}
		}

		curl_setopt($ch, CURLOPT_HTTPHEADER, $headerOptions);
		$response = curl_exec($ch);
		$err = curl_error($ch);
		curl_close($ch);

		if ($err)
		{
			return $err;
		}
		else
		{
			return $response;
		};
	}
}

?>
